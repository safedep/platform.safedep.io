import OpenSSFScorecardCard from "./openssf-score-card";
import LicenseStatsCard from "./license-stats-card";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import VulnerabilityStatsCard from "./vulnerability-stats-card";

export default function StatsCards({
  openSSFScore,
  licenses,
  vulnerabilities,
}: {
  openSSFScore: number;
  licenses: string[];
  vulnerabilities: Vulnerability[];
}) {
  return (
    <div className="@container/cards">
      <div className="grid auto-rows-fr grid-cols-2 gap-6 @xl/cards:grid-cols-3">
        <VulnerabilityStatsCard vulnerabilities={vulnerabilities} />
        <OpenSSFScorecardCard score={openSSFScore} />
        <LicenseStatsCard licenses={licenses} />
      </div>
    </div>
  );
}
