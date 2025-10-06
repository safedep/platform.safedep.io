import { Card, CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";

export default function MaliciousComponentsCard({ count }: { count: number }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Malicious Components</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex justify-center">
          <span className="text-3xl font-bold">{count}</span>
        </div>
      </CardContent>
    </Card>
  );
}
