import { Badge } from "@/components/ui/badge";
import { PackageSafety } from "@/lib/inference";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ShieldCheck,
  XOctagon,
  AlertCircle,
  FileWarning,
  Wrench,
  Users,
  ThumbsDown,
} from "lucide-react";

function getBadgeColor(safety: PackageSafety) {
  switch (safety) {
    case "safe":
      return "bg-green-100 text-green-800";
    case "suspicious":
      return "bg-yellow-100 text-yellow-800";
    case "malicious":
      return "bg-red-100 text-red-800";
    case "vulnerable":
      return "bg-orange-100 text-orange-800";
    case "risky license":
      return "bg-amber-100 text-amber-800";
    case "unmaintained":
      return "bg-slate-200 text-slate-800";
    case "unpopular":
      return "bg-blue-100 text-blue-800";
    case "poor security hygiene":
      return "bg-rose-100 text-rose-800";
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
    case "vulnerable":
      return AlertCircle;
    case "risky license":
      return FileWarning;
    case "unmaintained":
      return Wrench;
    case "unpopular":
      return Users;
    case "poor security hygiene":
      return ThumbsDown;
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
      <span className="capitalize">{safety.replaceAll("_", " ")}</span>
    </Badge>
  );
}
