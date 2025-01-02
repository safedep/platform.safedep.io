"use client";

import {
  Report_FileEvidence,
  Report_ProjectEvidence,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Confidence from "./confidence";

export function Evidences({
  fileEvidences,
  projectEvidences,
}: {
  fileEvidences: Report_FileEvidence[];
  projectEvidences: Report_ProjectEvidence[];
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
                {evidence?.evidence?.title || "Unknown Title"}
              </span>
              <span className="text-gray-600">
                {evidence?.evidence?.source || "Unknown Source"}
              </span>
              <span className="text-gray-600">
                <Confidence confidence={evidence?.evidence?.confidence ?? 0} />
              </span>
            </div>
            {expandedItems.includes(index) ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedItems.includes(index) && (
            <div className="px-4 py-2 bg-gray-50 text-gray-700">
              <p>
                <strong>Behavior:</strong>{" "}
                {evidence?.evidence?.behavior || "N/A"}
              </p>
              <p>
                <strong>Details:</strong> {evidence?.evidence?.details || "N/A"}
              </p>
              {(evidence as Report_FileEvidence).fileKey && (
                <p>
                  <strong>File:</strong>{" "}
                  {(evidence as Report_FileEvidence).fileKey}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
