"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

type PackageAnalysis = {
  componentName: string;
  details: string;
  detectionSource: string; // enum
  type: string; // enum type=rating (safe, suspicious etc.)
};

function createColumns() {
  const helper = createColumnHelper<PackageAnalysis>();

  return [
    helper.accessor("componentName", {
      header: "Component Name",
    }),
    helper.accessor("details", {
      header: "Details",
    }),
    helper.accessor("detectionSource", {
      header: "Detection Source",
    }),
    helper.accessor("type", {
      header: "Type",
    }),
  ] as ColumnDef<PackageAnalysis>[];
}

export default function PackageAnalysisTab() {
  const columns = createColumns();
  return (
    <div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
}
