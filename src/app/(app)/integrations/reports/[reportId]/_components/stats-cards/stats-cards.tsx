import ComponentsCard from "./components-card";
import MaliciousComponentsCard from "./malicious-components-card";
import PolicyViolationsCard from "./policy-violations-card";
import SuspiciousComponentsCard from "./suspicious-components-card";
import VulnerabilitiesCard from "./vulnerabilities-card";

export default function StatsCards({
  componentsCount,
  vulnerabilitiesCount,
  maliciousComponentsCount,
  policyViolationsCount,
  suspiciousComponentsCount,
}: {
  componentsCount: number;
  vulnerabilitiesCount: number;
  maliciousComponentsCount: number;
  policyViolationsCount: number;
  suspiciousComponentsCount: number;
}) {
  return (
    <div className="@container/cards flex flex-col gap-6">
      <div className="flex w-full flex-wrap gap-6">
        <VulnerabilitiesCard count={vulnerabilitiesCount} />
        <PolicyViolationsCard count={policyViolationsCount} />
        <ComponentsCard count={componentsCount} />
        <SuspiciousComponentsCard count={suspiciousComponentsCount} />
        <MaliciousComponentsCard count={maliciousComponentsCount} />
      </div>
    </div>
  );
}
