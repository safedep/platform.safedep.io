import { Card, CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function getScoreColor(score: number) {
  if (score >= 8) {
    return "text-green-600";
  }
  if (score >= 6) {
    return "text-yellow-600";
  }
  if (score >= 4) {
    return "text-orange-600";
  }
  return "text-red-600";
}

export default function OpenSSFScorecardCard({ score }: { score: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenSSF Scorecard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className={cn("text-3xl font-bold", getScoreColor(score))}>
            {score.toFixed(1)}
          </div>
          <p className="text-muted-foreground text-sm">
            Overall security score out of 10
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
