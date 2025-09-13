"use server";
import MarkdownContent from "@/components/markdown-content";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import AnalysisDataTable from "../analysis-data-table";
import { Report } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AnalysisTab({
  report: reportValue,
}: {
  report: Promise<Report | undefined>;
}) {
  const report = await reportValue;

  if (!report) {
    return <div>AnalysisTab No analysis found</div>;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardAction>
            <Button asChild size="sm" variant="link">
              <Link href={`/community/malysis/${report.reportId}`}>
                View full analysis
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">Summary</h2>
            <MarkdownContent
              content={report.inference?.summary ?? ""}
              className="text-sm/6"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <h2 className="text-base font-semibold">Details</h2>
            <MarkdownContent
              content={report.inference?.details ?? ""}
              className="text-sm/6 text-balance"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">Evidences</h2>
            <AnalysisDataTable evidences={report.fileEvidences ?? []} />
          </div>
        </CardContent>

        <CardFooter className="text-muted-foreground text-sm">
          <span>
            Analysis performed at{" "}
            {report.analyzedAt
              ? timestampDate(report.analyzedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "unknown"}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
