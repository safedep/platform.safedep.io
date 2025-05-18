import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Report_FileEvidence,
  type Report_ProjectEvidence,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import ConfidenceBadge from "./confidence-badge";
import MarkdownContent from "@/components/markdown-content";

interface EvidenceRowProps {
  evidence: Report_FileEvidence | Report_ProjectEvidence;
}

export default function EvidenceRow({ evidence }: EvidenceRowProps) {
  return (
    <Collapsible className="rounded-lg border">
      <CollapsibleTrigger className="hover:bg-muted/50 flex w-full flex-col items-start justify-between p-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <div className="text-left">
            {evidence.evidence?.title ?? "Unknown"}
          </div>
          <div className="text-muted-foreground text-left text-sm">
            {evidence?.evidence?.source ?? "Unknown Source"}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4 sm:pt-0">
          <ConfidenceBadge confidence={evidence.evidence?.confidence ?? 0} />
          <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="space-y-4 p-4 pt-0">
          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              Behavior
            </h3>
            <p className="text-sm">{evidence?.evidence?.behavior ?? "N/A"}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              Details
            </h3>
            <div className="text-sm">
              <MarkdownContent content={evidence.evidence?.details ?? "N/A"} />
            </div>
          </div>

          {"fileKey" in evidence && (
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">
                File
              </h3>
              <p className="font-mono text-sm">{evidence.fileKey}</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
