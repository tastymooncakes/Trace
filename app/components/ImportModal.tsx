"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (imageData: string) => void;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select a PNG or JPG image",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setPreview(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview);
      setPreview(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#252526] border border-[#2D2D30] rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="p-4 border-b border-[#2D2D30] flex items-center justify-between">
          <h3 className="text-white font-semibold">Import Existing Artwork</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="border-2 border-dashed border-[#3C3C3C] rounded-lg p-8 text-center hover:border-[#464646] transition-colors">
            {!preview ? (
              <label className="cursor-pointer block">
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-300 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 text-sm">PNG or JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded border border-[#3C3C3C]"
                />
                <button
                  onClick={() => setPreview(null)}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  Choose different image
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-[#1E1E1E] rounded border border-[#2D2D30]">
            <p className="text-gray-400 text-sm">
              <strong className="text-white">Note:</strong> Imported images
              start provenance tracking from this point forward. For full
              provenance from creation, use &quot;New Drawing&quot; instead.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D2D30] flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#3C3C3C] text-gray-300 hover:bg-[#464646] rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!preview}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm flex items-center gap-2"
          >
            <Upload size={16} />
            <span>Import & Start Tracking</span>
          </button>
        </div>
      </div>
    </div>
  );
}
