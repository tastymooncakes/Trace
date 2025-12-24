import { DrawingAction, Point } from "@/app/domain/entities";
import {
  drawLine,
  drawEraseLine,
  beginDrawing,
  clearCanvas as clearCanvasAdapter,
} from "./canvasAdapter";

export class CanvasReplay {
  static replayActions(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    actions: DrawingAction[]
  ): void {
    clearCanvasAdapter(canvas, ctx);

    for (const action of actions) {
      switch (action.type) {
        case "stroke":
          if (action.params.points && action.params.points.length > 0) {
            beginDrawing(ctx, action.params.points[0]);
            for (let i = 1; i < action.params.points.length; i++) {
              drawLine(
                ctx,
                action.params.points[i],
                action.params.color!,
                action.params.brushSize!
              );
            }
          }
          break;

        case "erase": // ADD THIS CASE
          if (action.params.points && action.params.points.length > 0) {
            beginDrawing(ctx, action.params.points[0]);
            for (let i = 1; i < action.params.points.length; i++) {
              drawEraseLine(
                ctx,
                action.params.points[i],
                action.params.brushSize!
              );
            }
          }
          break;

        case "clear":
          clearCanvasAdapter(canvas, ctx);
          break;

        case "undo":
        case "redo":
          break;
      }
    }
  }

  static getVisibleActions(allActions: DrawingAction[]): DrawingAction[] {
    const undoneActionIds = new Set<number>();

    for (const action of allActions) {
      if (action.type === "undo" && action.params.undoActionId) {
        undoneActionIds.add(action.params.undoActionId);
      } else if (action.type === "redo" && action.params.undoActionId) {
        undoneActionIds.delete(action.params.undoActionId);
      }
    }

    const visibleActions: DrawingAction[] = [];

    for (const action of allActions) {
      if (action.type === "undo" || action.type === "redo") {
        continue;
      }

      if (undoneActionIds.has(action.id!)) {
        continue;
      }

      visibleActions.push(action);
    }

    return visibleActions;
  }
}
