"use client";

import { Registration, CompletedWork } from "../domain/entities";

interface PropertiesPanelProps {
  registrations: Registration[];
  completedWorks: CompletedWork[];
}

export function PropertiesPanel({
  registrations,
  completedWorks,
}: PropertiesPanelProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#2D2D30]">
        <h2 className="text-white font-semibold text-sm">PROPERTIES</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Checkpoints Section */}
        <div className="border-b border-[#2D2D30]">
          <div className="p-3 bg-[#2D2D30]">
            <h3 className="text-gray-300 text-xs font-semibold uppercase">
              Checkpoints ({registrations.length})
            </h3>
          </div>
          <div className="p-3 space-y-2">
            {registrations.length === 0 ? (
              <p className="text-gray-500 text-xs">No checkpoints yet</p>
            ) : (
              registrations.map((reg, index) => (
                <a
                  key={reg.nid}
                  href={`https://verify.numbersprotocol.io/asset-profile/${reg.nid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-[#2D2D30] hover:bg-[#37373D] rounded transition-colors"
                >
                  <div className="text-white text-xs font-medium mb-1">
                    Checkpoint #{index + 1}
                  </div>
                  <div className="text-gray-400 text-xs font-mono truncate">
                    {reg.nid}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(reg.timestamp).toLocaleString()}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Completed Works Section */}
        <div>
          <div className="p-3 bg-[#2D2D30]">
            <h3 className="text-gray-300 text-xs font-semibold uppercase">
              Completed Works ({completedWorks.length})
            </h3>
          </div>
          <div className="p-3 space-y-2">
            {completedWorks.length === 0 ? (
              <p className="text-gray-500 text-xs">No completed works yet</p>
            ) : (
              completedWorks.map((work, index) => (
                <a
                  key={work.nid}
                  href={`https://verify.numbersprotocol.io/asset-profile/${work.nid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-[#2D2D30] hover:bg-[#37373D] rounded transition-colors"
                >
                  <div className="text-white text-xs font-medium mb-1">
                    Final Work #{index + 1}
                  </div>
                  <div className="text-gray-400 text-xs font-mono truncate">
                    {work.nid}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {work.iterationCount} iterations •{" "}
                    {new Date(work.timestamp).toLocaleString()}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
