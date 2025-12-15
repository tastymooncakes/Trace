import { BrushSize, Color } from "@/app/domain/entities";

export interface Point {
  x: number;
  y: number;
}

export function initializeCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  return ctx;
}

export function beginDrawing(ctx: CanvasRenderingContext2D, point: Point): void {
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: Color,
  size: BrushSize
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

export function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create blob'))),
      'image/png'
    );
  });
}

export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}