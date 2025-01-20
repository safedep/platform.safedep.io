import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EvidenceRowProps {
  name: string;
  type: string;
  confidence: "Low" | "Medium" | "High";
  behavior: string;
  details: string[];
  file: string;
}

export function EvidenceRow({
  name,
  type,
  confidence,
  behavior,
  details,
  file,
}: EvidenceRowProps) {
  return (
    <Collapsible className="border rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
        <div className="flex items-center gap-4">
          <div className="font-mono">{name}</div>
          <div className="text-muted-foreground">{type}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{confidence}</Badge>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 pt-0 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Behavior
            </h3>
            <p className="text-sm">{behavior}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Details
            </h3>
            <pre className="text-sm bg-muted p-2 rounded-md font-mono whitespace-pre-wrap">
              {details.join("\n")}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">File</h3>
            <p className="text-sm font-mono">{file}</p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
