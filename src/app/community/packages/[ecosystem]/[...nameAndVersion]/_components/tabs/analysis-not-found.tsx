import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";

export default function AnalysisNotFound() {
  return (
    <Card>
      <CardContent className="text-muted-foreground flex flex-col items-center gap-2 p-6 text-sm">
        <FileX className="size-8" />
        <span>No analysis is available for this package version yet.</span>
      </CardContent>
    </Card>
  );
}
