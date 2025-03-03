import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    severity: "Critical",
    avgDays: 2.5,
    target: 3,
  },
  {
    severity: "High",
    avgDays: 4.8,
    target: 5,
  },
  {
    severity: "Medium",
    avgDays: 8.2,
    target: 10,
  },
  {
    severity: "Low",
    avgDays: 15.6,
    target: 15,
  },
];

export function RemediationVelocity() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Remediation Velocity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" />
              <YAxis
                label={{ value: "Days", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="avgDays"
                name="Average Days to Fix"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="target"
                name="Target SLA"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
