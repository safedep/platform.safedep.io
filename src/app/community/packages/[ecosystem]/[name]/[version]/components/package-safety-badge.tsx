"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";

export enum PackageSafetyStatus {
  Safe = "Safe",
  Malicious = "Malicious",
  PossiblyMalicious = "Possibly Malicious",
  Vulnerable = "Vulnerable",
  Unmaintained = "Unmaintained",
  Unpopular = "Unpopular",
  PoorSecurityHygiene = "Poor Security Hygiene",
  Unknown = "Unknown",
}

interface PackageSafetyBadgeProps {
  status: PackageSafetyStatus;
  isLoading?: boolean;
}

export default function PackageSafetyBadge({
  status,
  isLoading = false,
}: PackageSafetyBadgeProps) {
  const getBadgeColor = (status: PackageSafetyStatus) => {
    switch (status) {
      case PackageSafetyStatus.Safe:
        return "bg-green-100 text-green-800";
      case PackageSafetyStatus.Malicious:
      case PackageSafetyStatus.Vulnerable:
        return "bg-red-100 text-red-800";
      case PackageSafetyStatus.PossiblyMalicious:
        return "bg-orange-100 text-orange-800";
      case PackageSafetyStatus.Unmaintained:
      case PackageSafetyStatus.Unpopular:
      case PackageSafetyStatus.PoorSecurityHygiene:
        return "bg-yellow-100 text-yellow-800";
      case PackageSafetyStatus.Unknown:
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    return status === PackageSafetyStatus.Safe ? (
      <ShieldCheck className="h-4 w-4" />
    ) : (
      <ShieldAlert className="h-4 w-4" />
    );
  };

  const getText = () => {
    return isLoading ? "Analyzing..." : status;
  };

  const getLoadingColor = () => {
    return isLoading ? "bg-blue-100 text-blue-800" : getBadgeColor(status);
  };

  return (
    <Badge
      variant="default"
      className={`text-md flex items-center gap-2 px-4 py-1 ${getLoadingColor()}`}
    >
      {getIcon()}
      {getText()}
    </Badge>
  );
}
