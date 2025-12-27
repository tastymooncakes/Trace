import { Color, BrushSize } from "./Drawing";

export type ActionType =
  | "stroke"
  | "erase"
  | "undo"
  | "redo"
  | "clear"
  | "import";
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
    color?: string;
    brushSize?: BrushSize;
    undoActionId?: number;
    imageData?: string; // Add this line
  };
  parentActionId?: number;
  stateHash?: string;
}
