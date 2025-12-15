'use client';

import { useRef, useCallback, useState } from 'react';
import { beginDrawing, canvasToBlob, canvasToDataURL, clearCanvas, drawLine, initializeCanvas, Point } from '../infrastructure/canvas/canvasAdapter';
import { BrushSize, Color } from '../domain/entities';


export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    ctxRef.current = initializeCanvas(canvasRef.current);
  }, []);

  // Get point from mouse event
  const getPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>, color: Color, brushSize: BrushSize) => {
      if (!ctxRef.current) return;
      const point = getPoint(e);
      beginDrawing(ctxRef.current, point);
      setIsDrawing(true);
    },
    [getPoint]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>, color: Color, brushSize: BrushSize) => {
      if (!isDrawing || !ctxRef.current) return;
      const point = getPoint(e);
      drawLine(ctxRef.current, point, color, brushSize);
    },
    [isDrawing, getPoint]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleClear = useCallback(() => {
    if (!canvasRef.current || !ctxRef.current) return;
    clearCanvas(canvasRef.current, ctxRef.current);
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
    exportCanvas,
  };
}