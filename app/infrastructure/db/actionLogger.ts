import { db } from "./indexedDB";
import {
  DrawingAction,
  ActionType,
  Point,
  Color,
  BrushSize,
} from "@/app/domain/entities";

export class ActionLogger {
  private currentSessionId: string | null = null;
  private lastActionId: number | null = null;

  async initSession(): Promise<string> {
    const lastSession = await db.sessions
      .orderBy("lastModified")
      .reverse()
      .first();

    if (lastSession && lastSession.sessionId) {
      this.currentSessionId = lastSession.sessionId;
      const actions = await db.actions
        .where("id")
        .anyOf(lastSession.actions)
        .reverse()
        .first();

      this.lastActionId = actions?.id || null;
      return lastSession.sessionId;
    }

    const sessionId = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    await db.sessions.add({
      sessionId,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      actions: [],
      checkpoints: [],
    });

    this.currentSessionId = sessionId;
    this.lastActionId = null;
    return sessionId;
  }

  async logAction(
    type: ActionType,
    params: {
      points?: Point[];
      color?: Color;
      brushSize?: BrushSize;
      undoActionId?: number;
    }
  ): Promise<number> {
    if (!this.currentSessionId) {
      await this.initSession();
    }

    const action: DrawingAction = {
      type,
      timestamp: new Date().toISOString(),
      params,
      parentActionId: this.lastActionId || undefined,
    };

    const actionId = await db.actions.add(action);
    this.lastActionId = actionId;

    const session = await db.sessions
      .where("sessionId")
      .equals(this.currentSessionId!)
      .first();

    if (session) {
      await db.sessions.update(session.id!, {
        actions: [...session.actions, actionId],
        lastModified: new Date().toISOString(),
      });
    }

    return actionId;
  }

  async getSessionActions(): Promise<DrawingAction[]> {
    if (!this.currentSessionId) return [];

    const session = await db.sessions
      .where("sessionId")
      .equals(this.currentSessionId)
      .first();

    if (!session) return [];

    return await db.actions.where("id").anyOf(session.actions).toArray();
  }

  async getActionsSinceLastCheckpoint(): Promise<DrawingAction[]> {
    if (!this.currentSessionId) return [];

    const session = await db.sessions
      .where("sessionId")
      .equals(this.currentSessionId)
      .first();

    if (!session || session.checkpoints.length === 0) {
      return this.getSessionActions();
    }

    const lastCheckpoint = session.checkpoints[session.checkpoints.length - 1];

    return await db.actions
      .where("id")
      .above(lastCheckpoint.actionId)
      .toArray();
  }

  async addCheckpoint(nid: string, canvasDataUrl?: string): Promise<void> {
    if (!this.currentSessionId || !this.lastActionId) return;

    const session = await db.sessions
      .where("sessionId")
      .equals(this.currentSessionId)
      .first();

    if (!session) return;

    const checkpoint = {
      actionId: this.lastActionId,
      nid,
      timestamp: new Date().toISOString(),
      canvasDataUrl,
    };

    await db.sessions.update(session.id!, {
      checkpoints: [...session.checkpoints, checkpoint],
      lastModified: new Date().toISOString(),
    });
  }

  async clearSession(): Promise<void> {
    if (!this.currentSessionId) return;

    const session = await db.sessions
      .where("sessionId")
      .equals(this.currentSessionId)
      .first();

    if (session) {
      await db.actions.bulkDelete(session.actions);
      await db.sessions.delete(session.id!);
    }

    this.currentSessionId = null;
    this.lastActionId = null;
  }

  async startNewSession(): Promise<string> {
    // Clear current session
    await this.clearSession();

    // Initialize a new one
    return await this.initSession();
  }

  async hasUnsavedWork(): Promise<boolean> {
    const actions = await this.getActionsSinceLastCheckpoint();
    return actions.length > 0;
  }
}

export const actionLogger = new ActionLogger();
