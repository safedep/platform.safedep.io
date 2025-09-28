"use client";

import { DataTable } from "@/components/ui/data-table";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

function createColumns() {
  const helper = createColumnHelper<Vulnerability>();

  return [
    // id
    helper.accessor("id.value", {
      header: "ID",
    }),
    // component
    helper.display({
      header: "Component",
    }),
    // description (details, summary)
    helper.accessor("summary", {
      header: "Description",
    }),
    // version
    helper.display({
      header: "Version",
    }),
    // severity
    helper.display({
      header: "Severity",
    }),
  ] as ColumnDef<Vulnerability>[];
}

export default function VulnerabilitiesTab() {
  const columns = createColumns();

  return (
    <div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
}
