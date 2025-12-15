'use client';

import { BrushSize } from '../domain/entities';
import { useDrawingStore } from '../hooks/useDrawingStore';

const SIZES: { size: BrushSize; label: string }[] = [
  { size: 2, label: 'Thin' },
  { size: 5, label: 'Normal' },
  { size: 10, label: 'Thick' },
  { size: 20, label: 'Bold' },
];

export function BrushSelector() {
  const brushSize = useDrawingStore((state) => state.brushSize);
  const setBrushSize = useDrawingStore((state) => state.setBrushSize);

  return (
    <div className="p-4 bg-[#1A1A1A] rounded-lg">
      <h3 className="text-white text-sm mb-2">Brush Size</h3>
      <div className="flex flex-wrap gap-2">
        {SIZES.map(({ size, label }) => (
          <button
            key={size}
            onClick={() => setBrushSize(size)}
            className={`px-4 py-2 rounded transition-colors ${
              brushSize === size
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}