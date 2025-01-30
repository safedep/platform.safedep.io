"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VersionList from "@/components/projects/version-list";
import {
  BOMWithAttributes,
  ProjectVersionWithAttributes,
} from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import { useEffect, useState } from "react";
import { BOM_Status } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/bom_pb";

function getBOMStatusName(status?: BOM_Status) {
  switch (status) {
    case BOM_Status.LATEST:
      return "Latest";
    case BOM_Status.HISTORICAL:
      return "Historical";
    case BOM_Status.UNSPECIFIED:
      return "Unspecified";
    default:
      return "Unknown";
  }
}

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
      <Tabs defaultValue="boms" className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-2 lg:block lg:w-fit">
          <TabsTrigger value="boms">BOMs</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">dependency-1</TableCell>
                <TableCell>v2.1.0</TableCell>
                <TableCell>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Secure
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">dependency-2</TableCell>
                <TableCell>v1.8.3</TableCell>
                <TableCell>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Secure
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">dependency-3</TableCell>
                <TableCell>v3.0.1</TableCell>
                <TableCell>
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                    Review Required
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>

        {/* BOM values */}
        <TabsContent value="boms">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BOM ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boms.map(({ bom }) => (
                <TableRow key={bom?.bomId}>
                  <TableCell className="font-medium font-mono">
                    {bom?.bomId}
                  </TableCell>
                  <TableCell>
                    {bom?.createdAt?.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getBOMStatusName(bom?.status)}</TableCell>
                  <TableCell>
                    {bom?.updatedAt?.toDate().toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
