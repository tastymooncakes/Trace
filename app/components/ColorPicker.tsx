'use client';

import { Color } from "../domain/entities";
import { useDrawingStore } from "../hooks/useDrawingStore";


const COLORS: Color[] = [
  '#000000', // Black
  '#FF6B35', // Orange
  '#00D9FF', // Cyan
  '#B56BFF', // Purple
  '#FFD93D', // Yellow
  '#6BCF7F', // Green
  '#FF5E78', // Pink
  '#FFFFFF', // White
];

export function ColorPicker() {
  const currentColor = useDrawingStore((state) => state.currentColor);
  const setColor = useDrawingStore((state) => state.setColor);

  return (
    <div className="p-4 bg-[#1A1A1A] rounded-lg">
      <h3 className="text-white text-sm mb-2">Colors</h3>
      <div className="flex gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setColor(color)}
            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
              currentColor === color ? 'border-white scale-110' : 'border-gray-600'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select ${color}`}
          />
        ))}
      </div>
    </div>
  );
}