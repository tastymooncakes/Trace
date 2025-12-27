"use client";

import { useRef, useCallback, useState } from "react";
import {
  beginDrawing,
  canvasToBlob,
  canvasToDataURL,
  clearCanvas,
  drawLine,
  drawEraseLine,
  initializeCanvas,
  Point,
} from "../infrastructure/canvas/canvasAdapter";
import { BrushSize, Color, DrawMode } from "../domain/entities";
import { actionLogger } from "../infrastructure/db/actionLogger";
import { CanvasReplay } from "../infrastructure/canvas/canvasReplay";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokePoints = useRef<Point[]>([]);

  const replayCanvas = useCallback(async () => {
    if (!canvasRef.current || !ctxRef.current) return;

    const allActions = await actionLogger.getSessionActions();
    const visibleActions = CanvasReplay.getVisibleActions(allActions);

    await CanvasReplay.replayActions(
      canvasRef.current,
      ctxRef.current,
      visibleActions
    );
  }, []);

  const initCanvas = useCallback(async () => {
    if (!canvasRef.current) return;
    ctxRef.current = initializeCanvas(canvasRef.current);

    // Initialize or resume session
    await actionLogger.initSession();

    // Smart detection: Check if we should start fresh
    const allActions = await actionLogger.getSessionActions();
    if (allActions.length > 0) {
      const lastAction = allActions[allActions.length - 1];

      // If last action type doesn't exist or was clear, it means "Finish" was called
      // and session was cleared, so this is a fresh start
      if (lastAction.type === "clear" && allActions.length === 1) {
        // This is the auto-clear from new session - don't replay
        return;
      }
    }

    // Replay existing actions
    await replayCanvas();
  }, [replayCanvas]);

  const getPoint = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement>,
      color: Color,
      brushSize: BrushSize,
      drawMode: DrawMode
    ) => {
      if (!ctxRef.current) return;
      const point = getPoint(e);
      beginDrawing(ctxRef.current, point);
      setIsDrawing(true);

      currentStrokePoints.current = [point];
    },
    [getPoint]
  );

  const handleMouseMove = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement>,
      color: Color,
      brushSize: BrushSize,
      drawMode: DrawMode
    ) => {
      if (!isDrawing || !ctxRef.current) return;
      const point = getPoint(e);

      if (drawMode === "erase") {
        drawEraseLine(ctxRef.current, point, brushSize);
      } else {
        drawLine(ctxRef.current, point, color, brushSize);
      }

      currentStrokePoints.current.push(point);
    },
    [isDrawing, getPoint]
  );

  const handleMouseUp = useCallback(
    async (color: Color, brushSize: BrushSize, drawMode: DrawMode) => {
      if (!isDrawing) return;

      setIsDrawing(false);

      if (currentStrokePoints.current.length > 0) {
        const actionType = drawMode === "erase" ? "erase" : "stroke";

        await actionLogger.logAction(actionType, {
          points: currentStrokePoints.current,
          color: drawMode === "draw" ? color : undefined,
          brushSize,
        });

        currentStrokePoints.current = [];
      }
    },
    [isDrawing]
  );

  const handleClear = useCallback(async () => {
    if (!canvasRef.current || !ctxRef.current) return;
    clearCanvas(canvasRef.current, ctxRef.current);

    await actionLogger.logAction("clear", {});
  }, []);

  const handleUndo = useCallback(async () => {
    const allActions = await actionLogger.getSessionActions();
    const visibleActions = CanvasReplay.getVisibleActions(allActions);

    if (visibleActions.length === 0) return;

    const lastAction = visibleActions[visibleActions.length - 1];

    await actionLogger.logAction("undo", {
      undoActionId: lastAction.id!,
    });

    await replayCanvas();
  }, [replayCanvas]);

  const handleRedo = useCallback(async () => {
    const allActions = await actionLogger.getSessionActions();

    let lastUndoActionId: number | null = null;

    for (let i = allActions.length - 1; i >= 0; i--) {
      const action = allActions[i];
      if (action.type === "undo") {
        const hasRedo = allActions.some(
          (a) =>
            a.type === "redo" &&
            a.params.undoActionId === action.params.undoActionId
        );
        if (!hasRedo) {
          lastUndoActionId = action.params.undoActionId!;
          break;
        }
      }
    }

    if (lastUndoActionId === null) return;

    await actionLogger.logAction("redo", {
      undoActionId: lastUndoActionId,
    });

    await replayCanvas();
  }, [replayCanvas]);

  const jumpToAction = useCallback(async (targetActionId: number) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const allActions = await actionLogger.getSessionActions();
    const actionsUpToTarget = allActions.filter(
      (action) => action.id && action.id <= targetActionId
    );

    const visibleActions = CanvasReplay.getVisibleActions(actionsUpToTarget);

    CanvasReplay.replayActions(
      canvasRef.current,
      ctxRef.current,
      visibleActions
    );
  }, []);

  const importImage = useCallback(async (imageData: string) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // Load and draw the image
    const img = new Image();
    img.onload = async () => {
      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw imported image scaled to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Log import action
      await actionLogger.logAction("import", { imageData });
    };
    img.src = imageData;
  }, []);

  const exportCanvas = useCallback(async () => {
    if (!canvasRef.current) return null;
    const blob = await canvasToBlob(canvasRef.current);
    const dataUrl = canvasToDataURL(canvasRef.current);
    return { blob, dataUrl };
  }, []);

  return {
    canvasRef,
    initCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClear,
    handleUndo,
    handleRedo,
    jumpToAction,
    importImage, // Add this line
    exportCanvas,
  };
}
