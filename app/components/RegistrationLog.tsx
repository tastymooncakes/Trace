'use client';

import { useDrawingStore } from "../hooks/useDrawingStore";


export function RegistrationLog() {
  const registrations = useDrawingStore((state) => state.registrations);

  if (registrations.length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-white text-sm mb-2">Registration Log</h3>
        <p className="text-gray-400 text-sm">No registrations yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#1A1A1A] rounded-lg">
      <h3 className="text-white text-sm mb-2">Registration Log ({registrations.length})</h3>
      <div className="space-y-2">
        {registrations.map((reg, index) => (
          <div key={reg.nid} className="p-3 bg-gray-700 rounded">
            <div className="text-white font-bold text-sm">#{index + 1}</div>
            <div className="text-cyan-400 text-xs break-all">{reg.nid}</div>
            <div className="text-gray-400 text-xs mt-1">
              {new Date(reg.timestamp).toLocaleString()}
            </div>
            <a
              href={`https://verify.numbersprotocol.io/asset-profile/${reg.nid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-xs hover:underline mt-1 inline-block"
            >
              View on Explorer →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}