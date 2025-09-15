"use server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getEcosystemIconByEcosystem } from "@/utils/ecosystem";
import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import {
  Package,
  Star,
  GitFork,
  ExternalLink,
  Tag,
  Download,
} from "lucide-react";
import PackageSafetyBadge from "./package-safety-badge";
import { SiGithub } from "react-icons/si";
import { VerificationRecord } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/verification_record_pb";
import { Report_Inference } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { ScorecardCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/scorecard/v1/scorecard_pb";
import { getPackageSafetyStatus } from "@/lib/inference";

function HeaderBadge({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant="outline"
      className={cn("flex items-center justify-center px-3", className)}
      {...props}
    >
      {children}
    </Badge>
  );
}

function PackageName({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <Package className="size-6" />
      <span className="text-xl font-bold sm:text-4xl">{name}</span>
    </div>
  );
}

export default async function PackageHeader({
  ecosystem,
  name,
  version,
  forks,
  stars,
  source,
  inference,
  verificationRecord,
  vulnerabilities,
  licenses,
  openSSFScore,
  scorecardChecks,
  downloadCount,
}: {
  name: string;
  version: string;
  ecosystem: Ecosystem;
  forks?: number;
  stars?: number;
  source?: string;
  inference?: Report_Inference;
  verificationRecord?: VerificationRecord;
  vulnerabilities?: Vulnerability[];
  licenses?: string[];
  openSSFScore?: number;
  scorecardChecks?: ScorecardCheck[];
  downloadCount?: number;
}) {
  const EcosystemIcon = getEcosystemIconByEcosystem(ecosystem);
  const safety = getPackageSafetyStatus(
    inference,
    verificationRecord,
    vulnerabilities,
    licenses,
    openSSFScore,
    scorecardChecks,
    stars,
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <PackageName name={name} />
            <PackageSafetyBadge safety={safety} />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            <HeaderBadge>
              <EcosystemIcon className="size-6!" />
            </HeaderBadge>
            <HeaderBadge>
              <Tag className="size-3" />
              <span className="text-sm">{version}</span>
            </HeaderBadge>
            {stars ? (
              <HeaderBadge>
                <Star className="size-3" />
                <span className="text-sm">{stars.toLocaleString()}</span>
              </HeaderBadge>
            ) : null}
            {forks ? (
              <HeaderBadge>
                <GitFork className="size-3" />
                <span className="text-sm">{forks.toLocaleString()}</span>
              </HeaderBadge>
            ) : null}
            {downloadCount ? (
              <HeaderBadge>
                <Download className="size-3" />
                <span className="text-sm">
                  {downloadCount.toLocaleString()}
                </span>
              </HeaderBadge>
            ) : null}
            {source ? (
              <HeaderBadge variant="default">
                <SiGithub className="size-3!" />
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm"
                >
                  <span>Source</span>
                  <ExternalLink className="size-3" />
                </a>
              </HeaderBadge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
