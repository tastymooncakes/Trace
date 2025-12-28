"use client";

import { useState } from "react";
import { X, User } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Load from localStorage using lazy initialization
  const [artistName, setArtistName] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("trace_artist_name") || ""
      : ""
  );
  const [defaultTitle, setDefaultTitle] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("trace_default_title") || "Untitled Artwork"
      : "Untitled Artwork"
  );
  const [defaultDescription, setDefaultDescription] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("trace_default_description") ||
        "Created with Trace"
      : "Created with Trace"
  );

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("trace_artist_name", artistName);
    localStorage.setItem("trace_default_title", defaultTitle);
    localStorage.setItem("trace_default_description", defaultDescription);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#252526] border border-[#2D2D30] rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-4 border-b border-[#2D2D30] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={20} className="text-gray-400" />
            <h3 className="text-white font-semibold">Artist Profile</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-2">
              Artist Name
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Your name or pseudonym"
              className="w-full px-3 py-2 bg-[#3C3C3C] text-white border border-[#2D2D30] rounded focus:outline-none focus:border-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">
              This will be attributed as the creator on blockchain registrations
            </p>
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-2">
              Default Artwork Title
            </label>
            <input
              type="text"
              value={defaultTitle}
              onChange={(e) => setDefaultTitle(e.target.value)}
              placeholder="Untitled Artwork"
              className="w-full px-3 py-2 bg-[#3C3C3C] text-white border border-[#2D2D30] rounded focus:outline-none focus:border-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">
              Default title for new works (you can override when saving)
            </p>
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-2">
              Default Description
            </label>
            <textarea
              value={defaultDescription}
              onChange={(e) => setDefaultDescription(e.target.value)}
              placeholder="Created with Trace"
              rows={3}
              className="w-full px-3 py-2 bg-[#3C3C3C] text-white border border-[#2D2D30] rounded focus:outline-none focus:border-blue-500 resize-none"
            />
            <p className="text-gray-500 text-xs mt-1">
              Default description for your artworks
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
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
