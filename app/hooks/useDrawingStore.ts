"use client";

import { create } from "zustand";
import {
  BrushSize,
  Color,
  Registration,
  CompletedWork,
  DrawMode,
} from "../domain/entities";

interface CanvasActions {
  clearCanvas: () => void;
  exportCanvas: () => Promise<{ blob: Blob; dataUrl: string } | null>;
  undoAction: () => void;
  redoAction: () => void;
  jumpToAction: (actionId: number) => void;
}

interface DrawingStore {
  // Drawing state
  currentColor: Color;
  brushSize: BrushSize;
  drawMode: DrawMode; // ADD THIS

  // Registration state (work in progress)
  registrations: Registration[];
  isRegistering: boolean;

  // Completed works (finals)
  completedWorks: CompletedWork[];

  // Canvas actions
  clearCanvas: (() => void) | null;
  exportCanvas: (() => Promise<{ blob: Blob; dataUrl: string } | null>) | null;
  undoAction: (() => void) | null;
  redoAction: (() => void) | null;

  jumpToAction: ((actionId: number) => void) | null;

  // Actions
  setColor: (color: Color) => void;
  setBrushSize: (size: BrushSize) => void;
  setDrawMode: (mode: DrawMode) => void; // ADD THIS
  addRegistration: (registration: Registration) => void;
  addCompletedWork: (work: CompletedWork) => void;
  clearRegistrations: () => void;
  setIsRegistering: (isRegistering: boolean) => void;
  setCanvasActions: (actions: CanvasActions) => void;
}

export const useDrawingStore = create<DrawingStore>((set) => ({
  // Initial state
  currentColor: "#000000",
  brushSize: 5,
  drawMode: "draw", // ADD THIS
  registrations: [],
  completedWorks: [],
  isRegistering: false,
  clearCanvas: null,
  exportCanvas: null,
  undoAction: null,
  redoAction: null,
  jumpToAction: null,

  // Actions
  setColor: (color) => set({ currentColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setDrawMode: (mode) => set({ drawMode: mode }), // ADD THIS
  addRegistration: (registration) =>
    set((state) => ({
      registrations: [...state.registrations, registration],
    })),
  addCompletedWork: (work) =>
    set((state) => ({
      completedWorks: [...state.completedWorks, work],
    })),
  clearRegistrations: () => set({ registrations: [] }),
  setIsRegistering: (isRegistering) => set({ isRegistering }),
  setCanvasActions: (actions) =>
    set({
      clearCanvas: actions.clearCanvas,
      exportCanvas: actions.exportCanvas,
      undoAction: actions.undoAction,
      redoAction: actions.redoAction,
      jumpToAction: actions.jumpToAction,
    }),
}));
