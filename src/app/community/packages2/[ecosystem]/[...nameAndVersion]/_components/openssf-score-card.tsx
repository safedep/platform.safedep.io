import { Card, CardFooter, CardHeader } from "@/components/ui/card";
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
      <CardContent className="flex-1">
        <div className="text-center">
          <div className={cn("text-3xl font-bold", getScoreColor(score))}>
            {score.toFixed(1)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center text-sm">
        <span>Overall security score out of 10</span>
      </CardFooter>
    </Card>
  );
}
