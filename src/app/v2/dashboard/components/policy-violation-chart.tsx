const policyViolationData = [
  {
    check: "Authentication",
    Violations: 120,
    fullMark: 150,
  },
  {
    check: "Authorization",
    Violations: 98,
    fullMark: 150,
  },
  {
    check: "Data Encryption",
    Violations: 86,
    fullMark: 150,
  },
  {
    check: "Network Security",
    Violations: 99,
    fullMark: 150,
  },
  {
    check: "Vulnerability Management",
    Violations: 85,
    fullMark: 150,
  },
  {
    check: "Incident Response",
    Violations: 65,
    fullMark: 150,
  },
];

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function PolicyChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Policy Violation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              outerRadius={90}
              width={730}
              height={250}
              data={policyViolationData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="check" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar
                name="Violations"
                dataKey="Violations"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
