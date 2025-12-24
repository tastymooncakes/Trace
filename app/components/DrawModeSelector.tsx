"use client";

import { useDrawingStore } from "../hooks/useDrawingStore";

export function DrawModeSelector() {
  const drawMode = useDrawingStore((state) => state.drawMode);
  const setDrawMode = useDrawingStore((state) => state.setDrawMode);

  return (
    <div className="flex gap-4 p-4 bg-[#1A1A1A] rounded-lg">
      <button
        onClick={() => setDrawMode("draw")}
        className={`px-6 py-2 rounded ${
          drawMode === "draw"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        ✏️ Draw
      </button>
      <button
        onClick={() => setDrawMode("erase")}
        className={`px-6 py-2 rounded ${
          drawMode === "erase"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        🧹 Erase
      </button>
    </div>
  );
}
