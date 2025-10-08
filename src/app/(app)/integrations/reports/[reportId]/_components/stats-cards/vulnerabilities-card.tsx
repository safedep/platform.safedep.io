import StatCard from "./stat-card";

export default function VulnerabilitiesCard({ count }: { count: number }) {
  return <StatCard title="Total Vulnerabilities" count={count} />;
}
