'use client';

import { useEffect } from 'react';
import { useDrawingStore } from '../hooks/useDrawingStore';
import { useCanvas } from '../hooks/useCanvas';

export function Canvas() {
  const { canvasRef, initCanvas, handleMouseDown, handleMouseMove, handleMouseUp, handleClear, exportCanvas } = useCanvas();
  const currentColor = useDrawingStore((state) => state.currentColor);
  const brushSize = useDrawingStore((state) => state.brushSize);
  const setCanvasActions = useDrawingStore((state) => state.setCanvasActions);

  useEffect(() => {
    initCanvas();
    // Register canvas actions in store
    setCanvasActions({ clearCanvas: handleClear, exportCanvas });
  }, [initCanvas, handleClear, exportCanvas, setCanvasActions]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[600px] bg-white rounded-lg shadow-lg cursor-crosshair"
      onMouseDown={(e) => handleMouseDown(e, currentColor, brushSize)}
      onMouseMove={(e) => handleMouseMove(e, currentColor, brushSize)}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}