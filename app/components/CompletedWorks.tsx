'use client';

import { useDrawingStore } from "../hooks/useDrawingStore";


export function CompletedWorks() {
  const completedWorks = useDrawingStore((state) => state.completedWorks);

  if (completedWorks.length === 0) {
    return null; // Don't show section if no completed works
  }

  return (
    <div className="p-4 bg-[#1A1A1A] rounded-lg">
      <h3 className="text-white text-lg font-bold mb-4">
        Completed Works ({completedWorks.length})
      </h3>
      <div className="space-y-4">
        {completedWorks.map((work, index) => (
          <div key={work.nid} className="p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-white font-bold">Final #{index + 1}</div>
                <div className="text-purple-400 text-xs">
                  {work.iterationCount} source iteration{work.iterationCount !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="text-gray-400 text-xs">
                {new Date(work.timestamp).toLocaleString()}
              </div>
            </div>
            
            {work.imageData && (
              <img 
                src={work.imageData} 
                alt={`Final composite ${index + 1}`}
                className="w-full rounded mb-2"
              />
            )}
            
            <div className="text-cyan-400 text-xs break-all mb-2">
              {work.nid}
            </div>
            
            <a
              href={`https://verify.numbersprotocol.io/asset-profile/${work.nid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-xs hover:underline inline-block mb-2"
            >
              View on Explorer →
            </a>
            
            <details className="mt-2">
              <summary className="text-gray-400 text-xs cursor-pointer hover:text-white">
                View Source Assets ({work.sourceAssets.length})
              </summary>
              <div className="mt-2 space-y-1 pl-4">
                {work.sourceAssets.map((source, idx) => (
                  <div key={source.nid} className="text-xs">
                    <span className="text-gray-400">#{idx + 1}: </span>
                    <a 
                      href={source.ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline"
                    >
                      {source.nid}
                    </a>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}