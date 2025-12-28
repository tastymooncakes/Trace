"use client";

import { useState } from "react";
import { Canvas } from "./components/Canvas";
import { Timeline } from "./components/Timeline";
import { ToolsPanel } from "./components/ToolsPanel";
import { ConfirmModal } from "./components/ConfirmModal";
import { ImportModal } from "./components/ImportModal";
import { useDrawingStore } from "./hooks/useDrawingStore";
import { actionLogger } from "./infrastructure/db/actionLogger";
import { Plus, Upload, Settings } from "lucide-react";
import { PropertiesPanel } from "./components/PropertiesPanels";
import { toast } from "sonner";
import { SettingsModal } from "./components/SettingsModal";

export default function Home() {
  const jumpToAction = useDrawingStore((state) => state.jumpToAction);
  const registrations = useDrawingStore((state) => state.registrations);
  const completedWorks = useDrawingStore((state) => state.completedWorks);
  const clearCanvas = useDrawingStore((state) => state.clearCanvas);
  const importImage = useDrawingStore((state) => state.importImage);

  const [showNewDrawingModal, setShowNewDrawingModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const handleNewDrawingClick = async () => {
    const hasUnsaved = await actionLogger.hasUnsavedWork();

    if (hasUnsaved) {
      setShowNewDrawingModal(true);
    } else {
      startNewDrawing();
    }
  };

  const startNewDrawing = async () => {
    await actionLogger.startNewSession();
    clearCanvas?.();
    setShowNewDrawingModal(false);
    setSessionKey((prev) => prev + 1);
  };

  const handleImport = async (imageData: string) => {
    // Start new session
    await actionLogger.startNewSession();

    // Clear canvas
    clearCanvas?.();

    // Close modal
    setShowImportModal(false);

    // Import image (don't remount canvas)
    setTimeout(() => {
      if (importImage) {
        importImage(imageData);
        toast.success("Image imported successfully", {
          description:
            "Provenance tracking started. Make edits and save checkpoints.",
          duration: 4000,
        });
      }
    }, 200);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1E1E1E] overflow-hidden">
      {/* Top Menu Bar */}
      <div className="h-12 bg-[#323233] border-b border-[#2D2D30] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-lg">Trace</span>
          <span className="text-gray-500 text-sm">
            — Provenance-First Creative Tool
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3 py-1.5 bg-[#3C3C3C] text-gray-300 hover:bg-[#464646] rounded text-sm flex items-center gap-2"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-1.5 bg-[#3C3C3C] text-white hover:bg-[#464646] rounded text-sm flex items-center gap-2"
          >
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button
            onClick={handleNewDrawingClick}
            className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Drawing</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#252526] border-r border-[#2D2D30] flex flex-col">
          <ToolsPanel />

          <div className="flex-1 border-t border-[#2D2D30] overflow-hidden">
            <Timeline onJumpToAction={(actionId) => jumpToAction?.(actionId)} />
          </div>
        </div>

        {/* Center Panel - Full Canvas */}
        <div className="flex-1 flex items-center justify-center bg-[#1E1E1E] p-4 overflow-hidden">
          <Canvas key={sessionKey} />
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-64 bg-[#252526] border-l border-[#2D2D30] overflow-hidden">
          <PropertiesPanel
            registrations={registrations}
            completedWorks={completedWorks}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-[#007ACC] text-white text-xs flex items-center px-4 gap-4">
        <span>Session Active</span>
        <span>•</span>
        <span>{registrations.length} Checkpoints</span>
        <span>•</span>
        <span>{completedWorks.length} Completed</span>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showNewDrawingModal}
        title="Start New Drawing?"
        message="You have unsaved work. Starting a new drawing will discard all actions since your last checkpoint. This cannot be undone."
        onConfirm={startNewDrawing}
        onCancel={() => setShowNewDrawingModal(false)}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
}
