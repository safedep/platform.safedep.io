import MarkdownContent from "@/components/markdown-content";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QueryPackageAnalysisResponse } from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import AnalysisDataTable from "../analysis-data-table";

export default async function AnalysisTab({
  value,
}: {
  value: Promise<QueryPackageAnalysisResponse | undefined>;
}) {
  const analysis = await value;

  if (!analysis) {
    return <div>AnalysisTab No analysis found</div>;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">Summary</h2>
            <MarkdownContent
              content={analysis.report?.inference?.summary ?? ""}
              className="text-sm/6"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <h2 className="text-base font-semibold">Details</h2>
            <MarkdownContent
              content={analysis.report?.inference?.details ?? ""}
              className="text-sm/6 text-balance"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">Evidences</h2>
            <AnalysisDataTable
              evidences={analysis.report?.fileEvidences ?? []}
            />
          </div>
        </CardContent>

        <CardFooter className="text-muted-foreground text-sm">
          Analysis performed at{" "}
          {analysis.report?.analyzedAt
            ? timestampDate(analysis.report.analyzedAt).toLocaleString(
                undefined,
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              )
            : "unknown"}
        </CardFooter>
      </Card>
    </div>
  );
}
