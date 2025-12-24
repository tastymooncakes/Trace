export type Color = string;
export type BrushSize = 2 | 5 | 10 | 20;
export type DrawMode = "draw" | "erase";

export interface Drawing {
  imageData: string;
  timestamp: string;
}
