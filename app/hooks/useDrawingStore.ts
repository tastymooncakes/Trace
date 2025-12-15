'use client';

import { create } from 'zustand';
import { BrushSize, Color, Registration, CompletedWork } from '../domain/entities';

interface DrawingStore {
  // Drawing state
  currentColor: Color;
  brushSize: BrushSize;
  
  // Registration state (work in progress)
  registrations: Registration[];
  isRegistering: boolean;
  
  // Completed works (finals)
  completedWorks: CompletedWork[];
  
  // Canvas actions (will be set by Canvas component)
  clearCanvas: (() => void) | null;
  exportCanvas: (() => Promise<{ blob: Blob; dataUrl: string } | null>) | null;
  
  // Actions
  setColor: (color: Color) => void;
  setBrushSize: (size: BrushSize) => void;
  addRegistration: (registration: Registration) => void;
  addCompletedWork: (work: CompletedWork) => void;
  clearRegistrations: () => void;
  setIsRegistering: (isRegistering: boolean) => void;
  setCanvasActions: (actions: {
    clearCanvas: () => void;
    exportCanvas: () => Promise<{ blob: Blob; dataUrl: string } | null>;
  }) => void;
}

export const useDrawingStore = create<DrawingStore>((set) => ({
  // Initial state
  currentColor: '#000000',
  brushSize: 5,
  registrations: [],
  completedWorks: [],
  isRegistering: false,
  clearCanvas: null,
  exportCanvas: null,
  
  // Actions
  setColor: (color) => set({ currentColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
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
  setCanvasActions: (actions) => set({
    clearCanvas: actions.clearCanvas,
    exportCanvas: actions.exportCanvas,
  }),
}));