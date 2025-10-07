import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StatCard({
  count,
  title,
}: {
  title: string;
  count: number;
}) {
  return (
    <Card className="min-w-36 flex-1 shrink-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex justify-center">
          <span className="text-3xl font-bold">{count}</span>
        </div>
      </CardContent>
    </Card>
  );
}
