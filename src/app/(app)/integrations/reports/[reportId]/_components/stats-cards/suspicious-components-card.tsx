import StatCard from "./stat-card";

export default function SuspiciousComponentsCard({ count }: { count: number }) {
  return <StatCard title="Suspicious Components" count={count} />;
}
