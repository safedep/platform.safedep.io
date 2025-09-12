import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OpenSSFScorecardCard from "./openssf-score-card";
import LicenseStatsCard from "./license-stats-card";

function VulnerabilityStatsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vulnerability Stats</CardTitle>
      </CardHeader>
      <CardContent>hello</CardContent>
    </Card>
  );
}

export default function StatsCards({
  openSSFScore,
  licenses,
}: {
  openSSFScore: number;
  licenses: string[];
}) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <VulnerabilityStatsCard />
      <OpenSSFScorecardCard score={openSSFScore} />
      <LicenseStatsCard licenses={licenses} />
    </div>
  );
}
