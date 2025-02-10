"use client";

import { RuleCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/rule_pb";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CircleHelp,
  Glasses,
  HeartPulse,
  OctagonX,
  Pickaxe,
  Scale,
  ShieldX,
  Sunrise,
} from "lucide-react";

export interface Violation {
  projectName?: string;
  projectVersion?: string;
  ruleName?: string;
  affectedComponent?: string;
  check?: RuleCheck;
  detectedAt?: Date;
}

function checkToName(check: RuleCheck) {
  switch (check) {
    case RuleCheck.LICENSE:
      return (
        <div className="flex items-center gap-2">
          <span>
            <Scale className="h-4 w-4" />
          </span>
          <span>License</span>
        </div>
      );
    case RuleCheck.VULNERABILITY:
      return (
        <div className="flex items-center gap-2">
          <span>
            <ShieldX className="h-4 w-4" />
          </span>
          <span>Vulnerability</span>
        </div>
      );
    case RuleCheck.MALWARE:
      return (
        <div className="flex items-center gap-2">
          <span>
            <OctagonX className="h-4 w-4" />
          </span>
          <span>Malware</span>
        </div>
      );
    case RuleCheck.POPULARITY:
      return (
        <div className="flex items-center gap-2">
          <span>
            <Sunrise className="h-4 w-4" />
          </span>
          <span>Popularity</span>
        </div>
      );
    case RuleCheck.MAINTENANCE:
      return (
        <div className="flex items-center gap-2">
          <span>
            <Pickaxe className="h-4 w-4" />
          </span>
          <span>Maintenance</span>
        </div>
      );
    case RuleCheck.PROJECT_SCORECARD:
      return (
        <div className="flex items-center gap-2">
          <span>
            <HeartPulse className="h-4 w-4" />
          </span>
          <span>Project Scorecard</span>
        </div>
      );
    case RuleCheck.PROVENANCE:
      return (
        <div className="flex items-center gap-2">
          <span>
            <Glasses className="h-4 w-4" />
          </span>
          <span>Provenance</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2">
          <span>
            <CircleHelp className="h-4 w-4" />
          </span>
          <span>Unknown</span>
        </div>
      );
  }
}

export const columns: ColumnDef<Violation>[] = [
  {
    accessorKey: "projectName",
    header: "Project",
  },
  {
    accessorKey: "projectVersion",
    header: "Project Version",
  },
  {
    accessorKey: "ruleName",
    header: "Rule",
  },
  {
    accessorKey: "affectedComponent",
    header: "Affected Component",
  },
  {
    accessorKey: "check",
    header: "Check",
    cell: ({ row }) => {
      // TODO: This should be a string representation of the enum value or some badge
      return checkToName(row.original.check ?? RuleCheck.UNSPECIFIED);
    },
  },
  {
    accessorKey: "detectedAt",
    header: "Detected At",
    cell: ({ row }) => {
      return <div>{row.original.detectedAt?.toLocaleDateString()}</div>;
    },
  },
];
