import VulnerabilityStatsCard from "@/app/community/packages/[ecosystem]/[...nameAndVersion]/_components/stats-cards/vulnerability-stats-card";
import ComponentsCard from "./components-card";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import MaliciousPackagesCard from "./malicious-packages-card";
import ManifestsCard from "./manifests-card";

export default function StatsCards({
  componentsCount,
  vulnerabilities,
  maliciousPackagesCount,
  manifestsCount,
}: {
  componentsCount: number;
  vulnerabilities: Vulnerability[];
  maliciousPackagesCount: number;
  manifestsCount: number;
}) {
  return (
    <div className="@container/cards">
      <div className="grid auto-rows-fr grid-cols-2 gap-6 @2xl/cards:grid-cols-4">
        <ComponentsCard count={componentsCount} />
        <VulnerabilityStatsCard vulnerabilities={vulnerabilities} />
        <MaliciousPackagesCard count={maliciousPackagesCount} />
        <ManifestsCard count={manifestsCount} />
      </div>
    </div>
  );
}
