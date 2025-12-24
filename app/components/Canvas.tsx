"use client";

import { useEffect, useState, useRef } from "react";
import { useDrawingStore } from "../hooks/useDrawingStore";
import { useCanvas } from "../hooks/useCanvas";

export function Canvas() {
  const {
    canvasRef,
    initCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClear,
    handleUndo,
    handleRedo,
    exportCanvas,
    jumpToAction,
  } = useCanvas();
  const currentColor = useDrawingStore((state) => state.currentColor);
  const brushSize = useDrawingStore((state) => state.brushSize);
  const drawMode = useDrawingStore((state) => state.drawMode);
  const setCanvasActions = useDrawingStore((state) => state.setCanvasActions);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    initCanvas();
    setCanvasActions({
      clearCanvas: handleClear,
      exportCanvas,
      undoAction: handleUndo,
      redoAction: handleRedo,
      jumpToAction,
    });
  }, [
    initCanvas,
    handleClear,
    handleUndo,
    handleRedo,
    exportCanvas,
    setCanvasActions,
    jumpToAction,
  ]);

  // Ensure canvas internal size matches display size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const canvas = canvasRef.current;

      // Get container dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Set canvas to fill container while maintaining aspect ratio
      const aspectRatio = 3 / 2; // 900/600
      let canvasWidth = containerWidth * 0.9; // 90% of container
      let canvasHeight = canvasWidth / aspectRatio;

      if (canvasHeight > containerHeight * 0.9) {
        canvasHeight = containerHeight * 0.9;
        canvasWidth = canvasHeight * aspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [canvasRef]);

  const handleMouseMoveWithCursor = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    handleMouseMove(e, currentColor, brushSize, drawMode);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeaveWithCursor = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    setCursorPosition(null);
    handleMouseUp(currentColor, brushSize, drawMode);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="bg-white rounded-lg shadow-lg"
          style={{ cursor: "none" }}
          onMouseDown={(e) =>
            handleMouseDown(e, currentColor, brushSize, drawMode)
          }
          onMouseMove={handleMouseMoveWithCursor}
          onMouseUp={() => handleMouseUp(currentColor, brushSize, drawMode)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeaveWithCursor}
        />

        {/* Cursor Preview */}
        {cursorPosition && (
          <div
            className="pointer-events-none absolute rounded-full border-2"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              width: brushSize * 2,
              height: brushSize * 2,
              transform: "translate(-50%, -50%)",
              borderColor: drawMode === "erase" ? "#ef4444" : currentColor,
              backgroundColor:
                drawMode === "erase"
                  ? "rgba(239, 68, 68, 0.1)"
                  : `${currentColor}20`,
            }}
          />
        )}
      </div>
    </div>
  );
}
