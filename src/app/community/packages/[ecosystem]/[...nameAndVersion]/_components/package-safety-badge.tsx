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
    case PackageSafety.SAFE:
      return "bg-green-100 text-green-800";
    case PackageSafety.SUSPICIOUS:
      return "bg-yellow-100 text-yellow-800";
    case PackageSafety.MALICIOUS:
      return "bg-red-100 text-red-800";
    case PackageSafety.VULNERABLE:
      return "bg-orange-100 text-orange-800";
    case PackageSafety.RISKY_LICENSE:
      return "bg-amber-100 text-amber-800";
    case PackageSafety.UNMAINTAINED:
      return "bg-slate-200 text-slate-800";
    case PackageSafety.UNPOPULAR:
      return "bg-blue-100 text-blue-800";
    case PackageSafety.POOR_SECURITY_HYGIENE:
      return "bg-rose-100 text-rose-800";
    default:
      const exhaustiveCheck: never = safety;
      throw new Error(`Unsupported safety: ${exhaustiveCheck}`);
  }
}

function getIcon(safety: PackageSafety) {
  switch (safety) {
    case PackageSafety.SAFE:
      return ShieldCheck;
    case PackageSafety.SUSPICIOUS:
      return AlertTriangle;
    case PackageSafety.MALICIOUS:
      return XOctagon;
    case PackageSafety.VULNERABLE:
      return AlertCircle;
    case PackageSafety.RISKY_LICENSE:
      return FileWarning;
    case PackageSafety.UNMAINTAINED:
      return Wrench;
    case PackageSafety.UNPOPULAR:
      return Users;
    case PackageSafety.POOR_SECURITY_HYGIENE:
      return ThumbsDown;
    default:
      const exhaustiveCheck: never = safety;
      throw new Error(`Unsupported safety: ${exhaustiveCheck}`);
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
