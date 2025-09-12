import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

function OpenSSFScorecardCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenSSF Scorecard</CardTitle>
      </CardHeader>
      <CardContent>hello</CardContent>
    </Card>
  );
}

function LicenseStatsCard() {
  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle>License Stats</CardTitle>
      </CardHeader>
      <CardContent>hello</CardContent>
    </Card>
  );
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <VulnerabilityStatsCard />
      <OpenSSFScorecardCard />
      <LicenseStatsCard />
    </div>
  );
}
