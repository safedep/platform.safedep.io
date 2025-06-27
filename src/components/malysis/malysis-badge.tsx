import { AlertTriangle, CheckIcon, Shield, XOctagon } from "lucide-react";
import type { MalwareAnalysisStatus } from "./malysis-report-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JSX } from "react";

const statusConfig: Record<
  MalwareAnalysisStatus,
  { label: string; icon: JSX.Element }
> = {
  safe: {
    label: "Safe",
    icon: <Shield className="h-4 w-4" />,
  },
  "possibly-malicious": {
    label: "Suspicious",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  malicious: {
    label: "Malicious",
    icon: <XOctagon className="h-4 w-4" />,
  },
};

export default function MalwareAnalysisBadge({
  malwareAnalysisStatus,
  verified,
}: {
  malwareAnalysisStatus: MalwareAnalysisStatus;
  verified?: boolean;
}) {
  const { label, icon } = statusConfig[malwareAnalysisStatus];
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex">
          <Badge
            className={cn("gap-2 px-4 py-2 text-base", {
              "border-green-500/20 bg-green-500/10 text-green-700 hover:bg-green-500/20":
                malwareAnalysisStatus === "safe",
              "border-yellow-400/20 bg-yellow-400/10 text-yellow-700 hover:bg-yellow-400/20":
                malwareAnalysisStatus === "possibly-malicious",
              "border-red-500/20 bg-red-500/10 text-red-700 hover:bg-red-500/20":
                malwareAnalysisStatus === "malicious",
            })}
          >
            {icon}
            {label}
          </Badge>
        </div>
        {verified && (
          <div className="ml-2 flex pt-1">
            <div className="flex justify-between rounded-full bg-green-200 px-2 py-1 pr-3 text-sm text-black">
              <CheckIcon className="h-4 w-4 pr-1" />
              Verified
            </div>
          </div>
        )}
      </div>
    </>
  );
}
