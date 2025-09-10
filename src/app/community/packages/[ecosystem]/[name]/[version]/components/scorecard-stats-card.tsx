import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle } from "lucide-react";
import { ProjectInsight } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/project_insight_pb";

interface ScorecardStatsCardProps {
  projectInsights: ProjectInsight[];
}

export default function ScorecardStatsCard({
  projectInsights,
}: ScorecardStatsCardProps) {
  const scorecard = projectInsights?.[0]?.scorecard;

  if (!scorecard) {
    return (
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-gray-500" />
            OpenSSF Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-500">N/A</div>
            <p className="text-muted-foreground text-sm">
              No scorecard data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallScore = scorecard.score;

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className={`h-5 w-5 ${getScoreColor(overallScore)}`} />
          OpenSSF Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main score */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore.toFixed(1)}
          </div>
          <p className="text-muted-foreground text-sm">
            Overall security score out of 10
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
