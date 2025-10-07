import StatCard from "./stat-card";

export default function ComponentsCard({ count }: { count: number }) {
  return <StatCard title="Total Components" count={count} />;
}
