"use client";

import { DataTable } from "@/components/ui/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { listScanComponents } from "../../actions";
import { getListScanComponentsQuery } from "../../queries";

type Component = {
  name: string;
  ecosystem: string; // Enum
  source: string; // Enum
  downloads: number;
  stars: number;
  version: string;
  vulnerabilitiesCount: number;
};

function createColumns() {
  const helper = createColumnHelper<Component>();

  return [
    helper.accessor("name", {
      header: "Name",
    }),
    helper.accessor("ecosystem", {
      header: "Ecosystem",
    }),
    helper.accessor("source", {
      header: "Source",
    }),
    helper.accessor("downloads", {
      header: "Downloads",
    }),
    helper.accessor("stars", {
      header: "Stars",
    }),
    helper.accessor("version", {
      header: "Version",
    }),
    helper.accessor("vulnerabilitiesCount", {
      header: "Vulnerabilities Count",
    }),
  ] as ColumnDef<Component>[];
}

export default function ComponentsTab({
  reportId,
  tenant,
}: {
  reportId: string;
  tenant: string;
}) {
  const {} = useSuspenseQuery({
    ...getListScanComponentsQuery({
      reportId,
      tenant,
    }),
  });
  const columns = createColumns();

  return (
    <div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
}
