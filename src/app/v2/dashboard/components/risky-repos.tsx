import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const data = [
  {
    name: "core-api",
    criticalCount: 2,
    highCount: 5,
    mediumCount: 8,
    // riskScore: 85,
  },
  {
    name: "payment-service",
    criticalCount: 1,
    highCount: 4,
    mediumCount: 6,
    // riskScore: 78,
  },
  {
    name: "auth-service",
    criticalCount: 1,
    highCount: 3,
    mediumCount: 7,
    // riskScore: 75,
  },
  {
    name: "frontend-web",
    criticalCount: 0,
    highCount: 4,
    mediumCount: 9,
    // riskScore: 72,
  },
  {
    name: "notification-service",
    criticalCount: 0,
    highCount: 3,
    mediumCount: 8,
    // riskScore: 68,
  },
];

export function TopRiskyRepos() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Top 5 High-Risk Repositories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead className="text-right">Critical</TableHead>
              <TableHead className="text-right">High</TableHead>
              <TableHead className="text-right">Medium</TableHead>
              {/* <TableHead className="text-right">Risk Score</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((repo) => (
              <TableRow key={repo.name}>
                <TableCell className="font-medium">{repo.name}</TableCell>
                <TableCell className="text-right">
                  {repo.criticalCount > 0 && (
                    <Badge variant="destructive">{repo.criticalCount}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-orange-100">
                    {repo.highCount}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-yellow-100">
                    {repo.mediumCount}
                  </Badge>
                </TableCell>
                {/* <TableCell className="text-right font-medium">
                  {repo.riskScore}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
