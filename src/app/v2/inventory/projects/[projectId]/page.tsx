"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import VersionList from "@/components/projects/version-list";
import {
  type ComponentWithAttributes,
  type BOMWithAttributes,
  type ProjectVersionWithAttributes,
  ListProjectVersionsResponse,
  ListProjectVersionBOMResponse,
  ListBOMComponentsResponse,
} from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import { useEffect, useState } from "react";
import ComponentsTable from "@/components/projects/components-table";
import BOMSTable from "@/components/projects/boms-table";
import { useParams } from "next/navigation";
import {
  listBOMComponents,
  listProjectVersionBOM,
  listProjectVersions,
} from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorPage from "@/components/projects/error-page";

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();

  const [versions, setVersions] = useState<ProjectVersionWithAttributes[]>();
  const [boms, setBoms] = useState<BOMWithAttributes[]>();
  const [components, setComponents] = useState<ComponentWithAttributes[]>();

  const [selectedVersion, setSelectedVersion] =
    useState<ProjectVersionWithAttributes>();

  const [error, setError] = useState<Error>();

  useEffect(() => {
    listProjectVersions(projectId)
      .then((x) => {
        const parsed = ListProjectVersionsResponse.fromBinary(x);
        setVersions(parsed.projectVersions);
      })
      .catch((e) => setError(e));
  }, [projectId]);

  // version is selected, fetch BOMs
  useEffect(() => {
    if (selectedVersion?.version?.projectVersionId) {
      setBoms(undefined);
      listProjectVersionBOM(selectedVersion.version?.projectVersionId)
        .then((x) => {
          const parsed = ListProjectVersionBOMResponse.fromBinary(x);
          setBoms(parsed.boms);
        })
        .catch((e) => setError(e));
    }
  }, [selectedVersion?.version?.projectVersionId]);

  // list LATEST BOM components for the selected version
  useEffect(() => {
    if (selectedVersion?.version?.projectVersionId) {
      // The user changed the version name from the drop down menu. Hence, put
      // the table in loading state because we are about to fetch component list
      // again.
      setComponents(undefined);
      listBOMComponents(selectedVersion.version?.projectVersionId)
        .then((x) => {
          const parsed = ListBOMComponentsResponse.fromBinary(x);
          setComponents(parsed.components);
        })
        .catch((e) => setError(e));
    }
  }, [selectedVersion?.version?.projectVersionId]);

  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-6 max-w-6xl min-h-[50vh] grid place-items-center">
        <ErrorPage error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border bg-card p-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {projectId} Project Details
          </h1>
        </div>
        {versions?.length ? (
          <VersionList versions={versions} onSelect={setSelectedVersion} />
        ) : (
          <Skeleton className="w-[250px] h-9" />
        )}
      </div>

      {/* Info Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6">
          {versions?.length ? (
            <InfoCardContent
              value={versions.length}
              message="Versions Available"
            />
          ) : (
            <>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </>
          )}
        </Card>
        <Card className="flex flex-col items-center justify-center p-6">
          {boms?.length ? (
            <InfoCardContent value={boms.length} message="BOMS" />
          ) : (
            <>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </>
          )}
        </Card>
      </div>

      {/* Tabs and Table */}
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-2 lg:block lg:w-fit">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="boms">BOMs</TabsTrigger>
        </TabsList>

        {/* BOM Components */}
        <TabsContent value="components">
          {components ? (
            <ComponentsTable components={components} />
          ) : (
            <div>Loading...</div>
          )}
        </TabsContent>

        {/* BOM values */}
        <TabsContent value="boms">
          {boms ? <BOMSTable boms={boms} /> : <div>Loading...</div>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoCardContent({
  value,
  message,
}: {
  value: number;
  message: string;
}) {
  return (
    <CardContent className="flex flex-col items-center justify-center p-6">
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-sm text-muted-foreground">{message}</span>
    </CardContent>
  );
}
