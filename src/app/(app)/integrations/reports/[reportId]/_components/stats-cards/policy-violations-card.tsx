import StatCard from "./stat-card";

export default function PolicyViolationsCard({ count }: { count: number }) {
  return <StatCard title="Policy Violations" count={count} />;
}
