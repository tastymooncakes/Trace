import { Color, BrushSize } from "./Drawing";

export type ActionType = "stroke" | "erase" | "undo" | "redo" | "clear";
export interface Point {
  x: number;
  y: number;
}

export interface DrawingAction {
  id?: number;
  type: ActionType;
  timestamp: string;
  params: {
    points?: Point[];
    color?: Color;
    brushSize?: BrushSize;
    undoActionId?: number;
  };
  parentActionId?: number;
  stateHash?: string;
}
