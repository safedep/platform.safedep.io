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
import { RuleCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/rule_pb";

/**
 * Converts a RuleCheck enum value to its display name
 * @param check - The RuleCheck enum value
 * @returns The display name for the check
 */
export function ruleCheckToIcon(check: RuleCheck) {
  switch (check) {
    case RuleCheck.LICENSE:
      return Scale;
    case RuleCheck.VULNERABILITY:
      return ShieldX;
    case RuleCheck.MALWARE:
      return OctagonX;
    case RuleCheck.POPULARITY:
      return Sunrise;
    case RuleCheck.MAINTENANCE:
      return Pickaxe;
    case RuleCheck.PROJECT_SCORECARD:
      return HeartPulse;
    case RuleCheck.PROVENANCE:
      return Glasses;
    case RuleCheck.UNSPECIFIED:
      return CircleHelp;
    default:
      const val: never = check;
      throw new Error(`Unknown check: ${val}`);
  }
}
