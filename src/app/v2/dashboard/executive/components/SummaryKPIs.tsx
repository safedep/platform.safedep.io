import { Card } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, Clock, TrendingUp } from "lucide-react";

const kpis = [
  {
    title: "Total Projects",
    value: "156",
    change: "+12",
    icon: ShieldCheck,
    description: "Projects being monitored",
  },
  {
    title: "Open Vulnerabilities",
    value: "23",
    change: "-5",
    icon: AlertTriangle,
    description: "Critical: 3, High: 8",
  },
  {
    title: "Policy Compliance",
    value: "72%",
    change: "-8",
    icon: TrendingUp,
    description: "Projects compliant with security policies",
  },
  {
    title: "Mean Time to Fix",
    value: "4.2d",
    change: "-0.8d",
    icon: Clock,
    description: "Average remediation time",
  },
];

export function SummaryKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </p>
              <div className="flex items-baseline mt-2">
                <p className="text-2xl font-semibold">{kpi.value}</p>
                <span
                  className={`ml-2 text-sm font-medium ${
                    kpi.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {kpi.description}
              </p>
            </div>
            <kpi.icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
}
