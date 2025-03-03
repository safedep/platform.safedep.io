"use client";

import { DashboardHeader } from "@/app/v2/dashboard/executive/components/DashboardHeader";
import { SummaryKPIs } from "@/app/v2/dashboard/executive/components/SummaryKPIs";
import { VulnerabilityTrends } from "@/app/v2/dashboard/executive/components/VulnerabilityTrends";
import { PolicyTrend } from "@/app/v2/dashboard/executive/components/PolicyTrend";
import { TopRiskyRepos } from "@/app/v2/dashboard/executive/components/TopRiskyRepos";
import { RemediationVelocity } from "@/app/v2/dashboard/executive/components/RemediationVelocity";

export default function Page() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader />

      {/* Summary KPIs Section */}
      <div className="grid grid-cols-1 gap-6">
        <SummaryKPIs />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VulnerabilityTrends />
        <PolicyTrend />
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RemediationVelocity />
        <TopRiskyRepos />
      </div>
    </div>
  );
}
