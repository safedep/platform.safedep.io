"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ExternalLink, Package, Star, GitFork, Github } from "lucide-react";
import { getEcosystemIcon } from "@/utils/ecosystem";
import PackageSafetyBadge, {
  PackageSafetyStatus,
} from "./package-safety-badge";

interface ProjectInsight {
  stars?: bigint | number;
  forks?: bigint | number;
  project?: {
    url?: string;
  };
}

interface PackageHeaderProps {
  ecosystem: string;
  name: string;
  version: string;
  defaultVersion?: string | boolean;
  projectInsight?: ProjectInsight;
  safetyStatus: PackageSafetyStatus;
  isSafetyLoading?: boolean;
}

export default function PackageHeader({
  ecosystem,
  name,
  version,
  defaultVersion,
  projectInsight,
  safetyStatus,
  isSafetyLoading = false,
}: PackageHeaderProps) {
  const EcosystemIcon = getEcosystemIcon(ecosystem);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            {/* Package Name */}
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8" />
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {name}
              </h1>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="flex items-center justify-center px-3 py-1 [&>svg]:!h-6 [&>svg]:!w-6"
              >
                <EcosystemIcon className="h-6 w-6" />
              </Badge>

              <Badge variant="outline" className="px-3 py-1 text-sm">
                v{version}
              </Badge>

              {projectInsight?.stars !== undefined &&
                Number(projectInsight.stars) > 0 && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                  >
                    <Star className="h-3 w-3" />
                    {Number(projectInsight.stars).toLocaleString()}
                  </Badge>
                )}

              {projectInsight?.forks !== undefined &&
                Number(projectInsight.forks) > 0 && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                  >
                    <GitFork className="h-3 w-3" />
                    {Number(projectInsight.forks).toLocaleString()}
                  </Badge>
                )}

              {projectInsight?.project?.url && (
                <a
                  href={projectInsight.project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Badge
                    variant="default"
                    className="flex cursor-pointer items-center gap-1 bg-gray-900 px-3 py-1 text-sm transition-colors hover:bg-gray-800"
                  >
                    <Github className="h-3 w-3" />
                    Source
                    <ExternalLink className="h-3 w-3" />
                  </Badge>
                </a>
              )}

              {defaultVersion &&
                typeof defaultVersion === "string" &&
                defaultVersion !== version && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    Latest: {defaultVersion}
                  </Badge>
                )}
            </div>
          </div>

          {/* Safety Badge */}
          <div className="flex items-center">
            <PackageSafetyBadge
              status={safetyStatus}
              isLoading={isSafetyLoading}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
