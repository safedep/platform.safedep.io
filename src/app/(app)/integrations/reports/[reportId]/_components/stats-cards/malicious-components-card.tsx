import StatCard from "./stat-card";

export default function MaliciousComponentsCard({ count }: { count: number }) {
  return <StatCard title="Malicious Components" count={count} />;
}
