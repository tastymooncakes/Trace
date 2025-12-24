"use client";

import { useEffect, useState } from "react";
import { DrawingAction, SessionCheckpoint } from "../domain/entities";
import { actionLogger } from "../infrastructure/db/actionLogger";
import { CanvasReplay } from "../infrastructure/canvas/canvasReplay";
import { db } from "../infrastructure/db/indexedDB";
import { TimelineControls } from "./TimelineControls";
import { Circle, CircleDot, X, Undo2, Redo2, MapPin } from "lucide-react";

interface TimelineProps {
  onJumpToAction: (actionId: number) => void;
}

export function Timeline({ onJumpToAction }: TimelineProps) {
  const [actions, setActions] = useState<DrawingAction[]>([]);
  const [checkpoints, setCheckpoints] = useState<SessionCheckpoint[]>([]);
  const [selectedActionId, setSelectedActionId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const allActions = await actionLogger.getSessionActions();
      setActions(allActions);

      const sessions = await db.sessions.toArray();
      if (sessions.length > 0) {
        setCheckpoints(sessions[0].checkpoints || []);
      }
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleActionClick = (actionId: number) => {
    setSelectedActionId(actionId);
    onJumpToAction(actionId);
  };

  const getActionIcon = (type: string, isCheckpoint: boolean) => {
    if (isCheckpoint) return <MapPin size={12} className="text-green-400" />;

    switch (type) {
      case "stroke":
        return <CircleDot size={12} />;
      case "erase":
        return <Circle size={12} />;
      case "clear":
        return <X size={12} />;
      case "undo":
        return <Undo2 size={12} />;
      case "redo":
        return <Redo2 size={12} />;
      default:
        return <Circle size={12} />;
    }
  };

  const getActionColor = (type: string, isCheckpoint: boolean) => {
    if (isCheckpoint) return "text-green-400";
    switch (type) {
      case "stroke":
        return "text-blue-400";
      case "erase":
        return "text-red-400";
      case "clear":
        return "text-gray-500";
      case "undo":
        return "text-yellow-400";
      case "redo":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const isCheckpoint = (actionId: number): boolean => {
    return checkpoints.some((cp) => cp.actionId === actionId);
  };

  const visibleActions = CanvasReplay.getVisibleActions(actions);

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      <div className="p-3 border-b border-[#2D2D30]">
        <h2 className="text-white font-semibold text-sm">TIMELINE</h2>
        <p className="text-gray-500 text-xs mt-1">
          {visibleActions.length} actions
        </p>
      </div>

      <div className="flex-1 overflow-y-auto text-xs font-mono">
        {actions.length === 0 ? (
          <div className="text-gray-500 text-center py-8 px-4">
            No actions yet
          </div>
        ) : (
          actions.map((action) => {
            const isVisible = visibleActions.some((a) => a.id === action.id);
            const isSelected = selectedActionId === action.id;
            const isCheckpointAction = action.id
              ? isCheckpoint(action.id)
              : false;

            return (
              <button
                key={action.id}
                onClick={() => action.id && handleActionClick(action.id)}
                className={`
                  w-full text-left px-3 py-1 hover:bg-[#2D2D30] transition-colors
                  ${isSelected ? "bg-[#37373D]" : ""}
                  ${!isVisible ? "opacity-40" : ""}
                `}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={getActionColor(action.type, isCheckpointAction)}
                  >
                    {getActionIcon(action.type, isCheckpointAction)}
                  </span>
                  <span className="text-gray-300 flex-1 truncate">
                    {action.type}
                    {action.params.color && ` ${action.params.color}`}
                  </span>
                  <span className="text-gray-500 text-[10px]">
                    #{action.id}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      <TimelineControls
        actionIds={visibleActions
          .map((a) => a.id!)
          .filter((id) => id !== undefined)}
        onPlayback={handleActionClick}
      />
    </div>
  );
}
