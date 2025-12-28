"use client";

import { BrushSize } from "../domain/entities";
import { toast } from "sonner";
import { useDrawingStore } from "../hooks/useDrawingStore";
import {
  Pencil,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Save,
  CheckCircle,
} from "lucide-react";

const COLORS = [
  "#000000",
  "#FF5E78",
  "#00D9FF",
  "#B56BFF",
  "#FFD93D",
  "#6BCF7F",
  "#FF9E64",
  "#FFFFFF",
];

const BRUSH_SIZES: BrushSize[] = [2, 5, 10, 20];

export function ToolsPanel() {
  const drawMode = useDrawingStore((state) => state.drawMode);
  const setDrawMode = useDrawingStore((state) => state.setDrawMode);
  const currentColor = useDrawingStore((state) => state.currentColor);
  const setColor = useDrawingStore((state) => state.setColor);
  const brushSize = useDrawingStore((state) => state.brushSize);
  const setBrushSize = useDrawingStore((state) => state.setBrushSize);
  const clearCanvas = useDrawingStore((state) => state.clearCanvas);
  const undoAction = useDrawingStore((state) => state.undoAction);
  const redoAction = useDrawingStore((state) => state.redoAction);
  const exportCanvas = useDrawingStore((state) => state.exportCanvas);
  const registrations = useDrawingStore((state) => state.registrations);
  const isRegistering = useDrawingStore((state) => state.isRegistering);
  const setIsRegistering = useDrawingStore((state) => state.setIsRegistering);
  const addRegistration = useDrawingStore((state) => state.addRegistration);
  const addCompletedWork = useDrawingStore((state) => state.addCompletedWork);
  const clearRegistrations = useDrawingStore(
    (state) => state.clearRegistrations
  );

  const handleSave = async () => {
    if (!exportCanvas) return;

    setIsRegistering(true);
    try {
      const { RegistrationService } = await import(
        "../infrastructure/api/registrationService"
      );
      const result = await exportCanvas();
      if (!result) throw new Error("Failed to export canvas");

      // Get artist profile from localStorage
      const artistName =
        localStorage.getItem("trace_artist_name") || "Anonymous";
      const defaultTitle =
        localStorage.getItem("trace_default_title") || "Untitled Artwork";

      const registration = await RegistrationService.registerDrawing(
        result.blob,
        result.dataUrl,
        {
          artistName,
          title: `${defaultTitle} - Checkpoint ${registrations.length + 1}`,
        }
      );

      addRegistration(registration);
      toast.success("Checkpoint saved to blockchain!", {
        description: `NID: ${registration.nid.slice(0, 12)}...`,
        duration: 5000,
      });
    } catch (error) {
      toast.error("Failed to save checkpoint", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleFinish = async () => {
    if (!exportCanvas || !clearCanvas) return;

    if (registrations.length === 0) {
      toast.warning("No checkpoints yet", {
        description: "Save at least one checkpoint before creating final work",
        duration: 4000,
      });
      return;
    }

    setIsRegistering(true);
    try {
      const { RegistrationService } = await import(
        "../infrastructure/api/registrationService"
      );
      const result = await exportCanvas();
      if (!result) throw new Error("Failed to export canvas");

      // Get artist profile from localStorage
      const artistName =
        localStorage.getItem("trace_artist_name") || "Anonymous";
      const defaultTitle =
        localStorage.getItem("trace_default_title") || "Untitled Artwork";
      const defaultDescription =
        localStorage.getItem("trace_default_description") ||
        "Created with Trace";

      const completedWork = await RegistrationService.registerFinalComposite(
        result.blob,
        result.dataUrl,
        registrations,
        {
          artistName,
          title: defaultTitle,
          description: defaultDescription,
        }
      );

      addCompletedWork(completedWork);
      clearRegistrations();
      clearCanvas();

      toast.success("Final work registered!", {
        description: `${
          completedWork.iterationCount
        } checkpoints linked. NID: ${completedWork.nid.slice(0, 12)}...`,
        duration: 6000,
      });
    } catch (error) {
      toast.error("Failed to create final work", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-[#2D2D30]">
        <h2 className="text-white font-semibold text-xs uppercase">Tools</h2>
      </div>

      <div className="p-3 space-y-3">
        {/* Draw Mode */}
        <div>
          <label className="text-gray-400 text-[10px] block mb-1 uppercase">
            Mode
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => setDrawMode("draw")}
              className={`flex-1 px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1 ${
                drawMode === "draw"
                  ? "bg-blue-600 text-white"
                  : "bg-[#3C3C3C] text-gray-300 hover:bg-[#464646]"
              }`}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setDrawMode("erase")}
              className={`flex-1 px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1 ${
                drawMode === "erase"
                  ? "bg-blue-600 text-white"
                  : "bg-[#3C3C3C] text-gray-300 hover:bg-[#464646]"
              }`}
            >
              <Eraser size={14} />
            </button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="text-gray-400 text-[10px] block mb-1 uppercase">
            Color
          </label>
          <div className="grid grid-cols-4 gap-1">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setColor(color)}
                className={`w-full aspect-square rounded border transition-all ${
                  currentColor === color
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-[#3C3C3C] hover:border-gray-600"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div>
          <label className="text-gray-400 text-[10px] block mb-1 uppercase">
            Size
          </label>
          <div className="grid grid-cols-4 gap-1">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`px-2 py-1 rounded text-xs ${
                  brushSize === size
                    ? "bg-blue-600 text-white"
                    : "bg-[#3C3C3C] text-gray-300 hover:bg-[#464646]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-[#2D2D30] space-y-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => undoAction?.()}
              className="px-2 py-1.5 bg-[#3C3C3C] text-gray-300 hover:bg-[#464646] rounded text-xs flex items-center justify-center gap-1"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={() => redoAction?.()}
              className="px-2 py-1.5 bg-[#3C3C3C] text-gray-300 hover:bg-[#464646] rounded text-xs flex items-center justify-center gap-1"
            >
              <Redo2 size={14} />
            </button>
          </div>

          <button
            onClick={() => clearCanvas?.()}
            className="w-full px-2 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded text-xs flex items-center justify-center gap-1"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>

        {/* Blockchain Actions */}
        <div className="pt-2 border-t border-[#2D2D30] space-y-1">
          <button
            onClick={handleSave}
            disabled={isRegistering}
            className="w-full px-2 py-1.5 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-600 rounded text-xs flex items-center justify-center gap-1"
          >
            <Save size={14} />
            <span>{isRegistering ? "Saving..." : "Save"}</span>
          </button>

          <button
            onClick={handleFinish}
            disabled={isRegistering || registrations.length === 0}
            className="w-full px-2 py-1.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 rounded text-xs flex items-center justify-center gap-1"
          >
            <CheckCircle size={14} />
            <span>Finish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
