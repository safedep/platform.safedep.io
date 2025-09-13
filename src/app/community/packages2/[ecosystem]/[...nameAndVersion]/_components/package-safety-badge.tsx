import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck, XOctagon } from "lucide-react";

export type PackageSafety = "safe" | "suspicious" | "malicious";

function getBadgeColor(safety: PackageSafety) {
  switch (safety) {
    case "safe":
      return "bg-green-100 text-green-800 bor";
    case "suspicious":
      return "bg-yellow-100 text-yellow-800";
    case "malicious":
      return "bg-red-100 text-red-800";
  }
}

function getIcon(safety: PackageSafety) {
  switch (safety) {
    case "safe":
      return ShieldCheck;
    case "suspicious":
      return AlertTriangle;
    case "malicious":
      return XOctagon;
  }
}

export default function PackageSafetyBadge({
  safety,
}: {
  safety: PackageSafety;
}) {
  const badgeColor = getBadgeColor(safety);
  const SafetyIcon = getIcon(safety);

  return (
    <Badge
      className={cn("text-md flex items-center gap-2 px-4 py-2", badgeColor)}
    >
      <SafetyIcon className="size-4!" />
      <span className="capitalize">{safety}</span>
    </Badge>
  );
}
