import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getEcosystemIconByEcosystem } from "@/utils/ecosystem";
import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { Package, Star, GitFork, ExternalLink, Tag } from "lucide-react";
import PackageSafetyBadge, { PackageSafety } from "./package-safety-badge";
import { SiGithub } from "react-icons/si";
import { VerificationRecord } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/verification_record_pb";
import {
  Report_Evidence_Confidence,
  Report_Inference,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";

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

export default function PackageHeader({
  ecosystem,
  name,
  version,
  forks,
  stars,
  source,
  inference,
  verificationRecord,
}: {
  name: string;
  version: string;
  ecosystem: Ecosystem;
  forks?: number;
  stars?: number;
  source?: string;
  inference?: Report_Inference;
  verificationRecord?: VerificationRecord;
}) {
  const EcosystemIcon = getEcosystemIconByEcosystem(ecosystem);
  const safety = getMalwareAnalysisStatus(inference, verificationRecord);

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

function getMalwareAnalysisStatus(
  inference?: Report_Inference,
  vr?: VerificationRecord,
): PackageSafety {
  // We will always trust the verification record if it exists
  if (vr && vr.isMalware) {
    return "malicious" as const;
  }

  if (vr && vr.isSafe) {
    return "safe" as const;
  }

  // Fallback to heuristic when a verification record is not available
  const isMalware = inference?.isMalware ?? false;
  const confidence = inference?.confidence ?? 0;
  const isPossiblyMalicious =
    isMalware && confidence !== Report_Evidence_Confidence.HIGH;

  if (isPossiblyMalicious) {
    return "suspicious";
  }

  if (isMalware) {
    return "malicious";
  }

  return "safe";
}
