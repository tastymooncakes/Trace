'use client';

import { useDrawingStore } from "../hooks/useDrawingStore";
import { RegistrationService } from "../infrastructure/api/registrationService";


export function ActionButtons() {
  const clearCanvas = useDrawingStore((state) => state.clearCanvas);
  const exportCanvas = useDrawingStore((state) => state.exportCanvas);
  const undoAction = useDrawingStore((state) => state.undoAction);
  const redoAction = useDrawingStore((state) => state.redoAction);
  const registrations = useDrawingStore((state) => state.registrations);
  const isRegistering = useDrawingStore((state) => state.isRegistering);
  const setIsRegistering = useDrawingStore((state) => state.setIsRegistering);
  const addRegistration = useDrawingStore((state) => state.addRegistration);
  const addCompletedWork = useDrawingStore((state) => state.addCompletedWork);
  const clearRegistrations = useDrawingStore((state) => state.clearRegistrations);

  const handleSave = async () => {
    if (!exportCanvas) return;
    
    setIsRegistering(true);
    try {
      const result = await exportCanvas();
      if (!result) throw new Error('Failed to export canvas');

      const registration = await RegistrationService.registerDrawing(
        result.blob,
        result.dataUrl
      );
      
      addRegistration(registration);
      alert(`Registered! NID: ${registration.nid}`);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleFinish = async () => {
    if (!exportCanvas || !clearCanvas) return;
    
    if (registrations.length === 0) {
      alert('No registrations to include. Draw and register some iterations first!');
      return;
    }

    setIsRegistering(true);
    try {
      const result = await exportCanvas();
      if (!result) throw new Error('Failed to export canvas');

      const completedWork = await RegistrationService.registerFinalComposite(
        result.blob,
        result.dataUrl,
        registrations
      );
      
      addCompletedWork(completedWork);
      clearRegistrations();
      clearCanvas();
      
      alert(`Final composite created! NID: ${completedWork.nid}\nSource iterations: ${completedWork.iterationCount}`);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClear = () => {
    if (clearCanvas) clearCanvas();
  };

  const handleUndo = () => {
    if (undoAction) undoAction();
  };

  const handleRedo = () => {
    if (redoAction) redoAction();
  };

  return (
    <div className="flex gap-4 p-4 bg-[#1A1A1A] rounded-lg flex-wrap">
      <button
        onClick={handleUndo}
        className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        Undo
      </button>
      <button
        onClick={handleRedo}
        className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        Redo
      </button>
      <button
        onClick={handleClear}
        className="px-6 py-2 bg-[#FF3300] text-white rounded hover:bg-red-700"
      >
        Clear Canvas
      </button>
      <button
        onClick={handleSave}
        disabled={isRegistering}
        className="px-6 py-bg-[#4F994C] text-white rounded hover:bg-[#4F994C] disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isRegistering ? 'Registering...' : 'Save & Register'}
      </button>
      <button
        onClick={handleFinish}
        disabled={isRegistering || registrations.length === 0}
        className="px-6 py-2 bg-[#2E52A0] text-white rounded hover:bg-[#2E52A0] disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        Finish & Create Final
      </button>
    </div>
  );
}