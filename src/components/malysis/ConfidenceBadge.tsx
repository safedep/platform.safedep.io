import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function ConfidenceBadge({
  confidence,
}: {
  confidence: "Low" | "Medium" | "High";
}) {
  return (
    <Badge
      className={cn({
        "bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20":
          confidence === "High",
        "bg-yellow-400/10 text-yellow-700 border-yellow-400/20 hover:bg-yellow-400/20":
          confidence === "Medium",
        "bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20":
          confidence === "Low",
      })}
    >
      {confidence}
    </Badge>
  );
}
