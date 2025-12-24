"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#252526] border border-[#2D2D30] rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b border-[#2D2D30]">
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-300 text-sm">{message}</p>
        </div>
        <div className="p-4 border-t border-[#2D2D30] flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[#3C3C3C] text-gray-300 hover:bg-[#464646] rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm"
          >
            Start New Drawing
          </button>
        </div>
      </div>
    </div>
  );
}
