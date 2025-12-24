"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface TimelineControlsProps {
  actionIds: number[];
  onPlayback: (actionId: number) => void;
}

export function TimelineControls({
  actionIds,
  onPlayback,
}: TimelineControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(500);
  const isPlayingRef = useRef(false);

  const playTimeline = async () => {
    setIsPlaying(true);
    isPlayingRef.current = true;

    for (let i = 0; i < actionIds.length; i++) {
      if (!isPlayingRef.current) {
        break;
      }

      const actionId = actionIds[i];
      setCurrentIndex(i);
      onPlayback(actionId);

      await new Promise((resolve) => setTimeout(resolve, playbackSpeed));
    }

    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentIndex(0);
  };

  const stopPlayback = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  return (
    <div className="p-4 border-t border-[#2D2D30] bg-[#252526]">
      <div className="space-y-3">
        <div className="flex gap-2">
          {!isPlaying ? (
            <button
              onClick={playTimeline}
              disabled={actionIds.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              <Play size={16} />
              <span>Play ({actionIds.length})</span>
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center justify-center gap-2"
            >
              <Pause size={16} />
              <span>Stop</span>
            </button>
          )}
        </div>

        <div>
          <label className="text-gray-400 text-xs block mb-1">
            Speed: {playbackSpeed}ms
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="w-full"
            disabled={isPlaying}
          />
        </div>

        {isPlaying && (
          <div className="text-gray-400 text-xs">
            Playing: {currentIndex + 1} / {actionIds.length}
          </div>
        )}
      </div>
    </div>
  );
}
