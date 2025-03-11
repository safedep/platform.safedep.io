import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    date: "2024-02-01",
    score: 65,
  },
  {
    date: "2024-02-08",
    score: 68,
  },
  {
    date: "2024-02-15",
    score: 64,
  },
  {
    date: "2024-02-22",
    score: 72,
  },
  {
    date: "2024-02-29",
    score: 72,
  },
];

const gradientOffset = () => {
  const dataMax = Math.max(...data.map((i) => i.score));
  const dataMin = Math.min(...data.map((i) => i.score));

  if (dataMax <= 0) {
    return 0;
  }
  if (dataMin >= 0) {
    return 1;
  }

  return dataMax / (dataMax - dataMin);
};

export function PolicyTrend() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Policy Violation Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => value.split("-").slice(1).join("/")}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset={gradientOffset()}
                    stopColor="#ef4444"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset={gradientOffset()}
                    stopColor="#22c55e"
                    stopOpacity={0.8}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                fill="url(#splitColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
