"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import VersionList from "@/components/projects/version-list";
import {
  BOMWithAttributes,
  ProjectVersionWithAttributes,
} from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import { useEffect, useState } from "react";
import { BOM_Status } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/bom_pb";
import ComponentsTable from "@/components/projects/components-table";
import BOMSTable from "@/components/projects/boms-table";

export default function ProjectDetails() {
  const versions = [
    new ProjectVersionWithAttributes({
      version: {
        projectId: "IDKLMN",
        version: "1.0.0",
        projectVersionId: "KTR",
      },
    }),
    new ProjectVersionWithAttributes({
      version: {
        projectId: "IDABCD",
        version: "2.0.0",
        projectVersionId: "PTR",
      },
    }),
    new ProjectVersionWithAttributes({
      version: {
        projectId: "IDABCD",
        version: "C.0.0",
        projectVersionId: "CTR",
      },
    }),
  ];

  const boms = [
    new BOMWithAttributes({
      attributes: {},
      bom: {
        bomId: "a",
        createdAt: undefined,
        status: BOM_Status.LATEST,
        updatedAt: undefined,
      },
    }),
  ];

  const [version, setVersion] = useState<ProjectVersionWithAttributes | null>();

  // TODO: fetch boms
  useEffect(() => {
    if (version) {
      // const service =
    }
  }, [version]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border bg-card p-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            apache/maven
          </h1>
        </div>
        <VersionList versions={versions} onSelect={setVersion} />
      </div>

      {/* Metadata */}
      <div className="mb-6 text-sm text-muted-foreground">
        Last updated: 2 hours ago
      </div>

      {/* Info Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <span className="text-3xl font-bold">{versions.length}</span>
            <span className="text-sm text-muted-foreground">
              Versions Available
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <span className="text-3xl font-bold">{boms.length}</span>
            <span className="text-sm text-muted-foreground">BOMs</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Table */}
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-2 lg:block lg:w-fit">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="boms">BOMs</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <ComponentsTable />
        </TabsContent>

        {/* BOM values */}
        <TabsContent value="boms">
          <BOMSTable boms={boms} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
