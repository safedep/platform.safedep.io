"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Evidence = {
  file_key?: string;
  evidence: {
    title: string;
    behavior: string;
    details: string;
    confidence: string;
    source: string;
  };
};

export function Evidences({
  fileEvidences,
  projectEvidences,
}: {
  fileEvidences: Evidence[];
  projectEvidences: Evidence[];
}) {
  const allEvidences = [...fileEvidences, ...projectEvidences];
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="space-y-4">
      {allEvidences.map((evidence, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-md shadow-sm"
        >
          <button
            className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
            onClick={() => toggleItem(index)}
          >
            <div className="flex-1 grid grid-cols-3 gap-4">
              <span className="font-medium text-gray-800">
                {evidence.evidence.title || "Unknown Title"}
              </span>
              <span className="text-gray-600">
                {evidence.evidence.source || "Unknown Source"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  evidence.evidence.confidence.startsWith("CONFIDENCE_")
                    ? " text-blue-800"
                    : " text-gray-800"
                }`}
              >
                {evidence.evidence.confidence.replace("CONFIDENCE_", "") ||
                  "Unknown"}
              </span>
            </div>
            {expandedItems.includes(index) ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedItems.includes(index) && (
            <div className="px-4 py-2 bg-gray-50 text-gray-700">
              <p>
                <strong>Behavior:</strong> {evidence.evidence.behavior || "N/A"}
              </p>
              <p>
                <strong>Details:</strong> {evidence.evidence.details || "N/A"}
              </p>
              {evidence.file_key && (
                <p>
                  <strong>File:</strong> {evidence.file_key}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
