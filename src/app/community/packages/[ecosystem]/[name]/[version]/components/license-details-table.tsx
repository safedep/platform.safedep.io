"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { FileText } from "lucide-react";
import { LicenseMetaList } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/license_meta_pb";
import { createLicenseDetailsColumns } from "../columns";

interface LicenseDetailsTableProps {
  licenses: LicenseMetaList | undefined;
}

export default function LicenseDetailsTable({
  licenses,
}: LicenseDetailsTableProps) {
  const columns = createLicenseDetailsColumns();
  const licenseList = licenses?.licenses || [];

  if (!licenses || licenseList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            License Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-32 items-center justify-center">
            No license information available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          License Details
        </CardTitle>
        <div className="text-muted-foreground text-sm">
          {licenseList.length} license{licenseList.length !== 1 ? "s" : ""}{" "}
          found
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 overflow-auto rounded-md border">
          <DataTable
            columns={columns}
            data={licenseList}
            emptyMessage="No license information available."
          />
        </div>
      </CardContent>
    </Card>
  );
}
