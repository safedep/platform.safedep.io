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
import ConfidenceBadge from "./ConfidenceBadge";
import MarkdownContent from "../MarkdownContent";

interface EvidenceRowProps {
  evidence: Report_FileEvidence | Report_ProjectEvidence;
}

export default function EvidenceRow({ evidence }: EvidenceRowProps) {
  return (
    <Collapsible className="border rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
        <div className="flex items-center gap-4">
          <div>{evidence.evidence?.title ?? "Unknown"}</div>
          <div className="text-muted-foreground text-sm">
            {evidence?.evidence?.source ?? "Unknown Source"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge confidence={evidence.evidence?.confidence ?? 0} />
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="p-4 pt-0 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Behavior
            </h3>
            <p className="text-sm">{evidence?.evidence?.behavior ?? "N/A"}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Details
            </h3>
            <div className="text-sm">
              <MarkdownContent content={evidence.evidence?.details ?? "N/A"} />
            </div>
          </div>

          {"fileKey" in evidence && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                File
              </h3>
              <p className="text-sm font-mono">{evidence.fileKey}</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
