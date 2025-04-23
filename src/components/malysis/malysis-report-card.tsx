import { ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EvidenceRow from "@/components/malysis/evidence-row";
import {
  Report_Evidence_Confidence,
  type Report,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import Link from "next/link";
import { useMemo } from "react";
import { packageRegistryUrl } from "@/lib/rpc/utils";
import MalwareAnalysisMetadata from "./malysis-metadata";
import MalwareAnalysisBadge from "./malysis-badge";
import { cn } from "@/lib/utils";
import MarkdownContent from "@/components/markdown-content";
import MalysisFilesystemTable from "./malysis-filesystem-table";
import MalysisWarningsTab from "./malysis-warnings-tab";
import { VerificationRecord } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/verification_record_pb";

export type MalwareAnalysisStatus = "safe" | "possibly-malicious" | "malicious";

function getMalwareAnalysisStatus(
  report: Report,
  vr?: VerificationRecord,
): MalwareAnalysisStatus {
  // We will always trust the verification record if it exists
  if (vr && vr.isMalware) {
    return "malicious";
  }

  if (vr && vr.isSafe) {
    return "safe";
  }

  // Fallback to heuristic when a verification record is not available
  const isMalware = report?.inference?.isMalware ?? false;
  const confidence = report.inference?.confidence ?? 0;
  const isPossiblyMalicious =
    isMalware && confidence !== Report_Evidence_Confidence.HIGH;

  if (isPossiblyMalicious) {
    return "possibly-malicious";
  }

  if (isMalware) {
    return "malicious";
  }

  return "safe";
}

export interface MalwareAnalysisReportCardProps {
  report: Report;
  verificationRecord?: VerificationRecord;
}

export default function MalwareAnalysisReportCard({
  report,
  verificationRecord,
}: MalwareAnalysisReportCardProps) {
  const malwareAnalysisStatus = getMalwareAnalysisStatus(
    report,
    verificationRecord,
  );
  const packageName = `${report.packageVersion?.package?.name}@${report.packageVersion?.version}`;
  const packageUrl = useMemo(() => {
    return packageRegistryUrl(report.packageVersion);
  }, [report.packageVersion]);
  const evidences = useMemo(
    () => [...report.fileEvidences, ...report.projectEvidences],
    [report.fileEvidences, report.projectEvidences],
  );

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      <Card
        className={cn("border-l-4", {
          "border-l-green-500": malwareAnalysisStatus === "safe",
          "border-l-yellow-400": malwareAnalysisStatus === "possibly-malicious",
          "border-l-red-500": malwareAnalysisStatus === "malicious",
        })}
      >
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="group font-mono text-2xl break-all">
              <Link
                href={packageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                {packageName}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </h1>
            <MalwareAnalysisBadge
              malwareAnalysisStatus={malwareAnalysisStatus}
              verified={!!verificationRecord}
            />
          </div>
          <MalwareAnalysisMetadata report={report} className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                This analysis was performed using{" "}
                <Link href="https://github.com/safedep/vet">vet</Link> and{" "}
                <Link
                  href="https://docs.safedep.io/cloud/malware-analysis"
                  className="underline transition hover:text-blue-800"
                  target="_blank"
                >
                  SafeDep Cloud Malicious Package Analysis
                </Link>
                . Integrate with GitHub using{" "}
                <Link
                  href="https://github.com/safedep/vet-action"
                  className="underline transition hover:text-blue-800"
                  target="_blank"
                >
                  vet-action
                </Link>{" "}
                GitHub Action.
              </p>
              <div className="border-b border-gray-100 pb-1"></div>
              <div className="text-muted-foreground pt-2">
                <MarkdownContent content={report.inference?.summary ?? ""} />
              </div>
            </CardContent>
          </Card>
          {verificationRecord && (
            <Card>
              <CardHeader>
                <CardTitle>Verification Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">
                  <MarkdownContent content={verificationRecord.reason} />
                </div>
                <div className="text-muted-foreground pt-4 text-sm">
                  <MarkdownContent content={verificationRecord.extraAnalysis} />
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <MarkdownContent content={report.inference?.details ?? ""} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="evidences">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="evidences">Evidences</TabsTrigger>
                  <TabsTrigger value="filesystems">Filesystems</TabsTrigger>
                  <TabsTrigger value="warnings">Warnings</TabsTrigger>
                </TabsList>

                <TabsContent value="evidences" className="mt-4">
                  <div className="space-y-2">
                    {evidences.map((evidence, index) => (
                      // FIXME: backend should provide a key for each evidence,
                      // for now we are using the index. This is BAD!
                      <EvidenceRow key={index} evidence={evidence} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="filesystems" className="mt-4">
                  <MalysisFilesystemTable
                    files={report.fileSystem?.files ?? []}
                  />
                </TabsContent>

                <TabsContent value="warnings" className="mt-4">
                  <MalysisWarningsTab warnings={report.warnings} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
