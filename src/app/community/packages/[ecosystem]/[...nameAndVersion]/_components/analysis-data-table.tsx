"use client";
import ConfidenceBadge from "@/components/malysis/confidence-badge";
import MarkdownContent from "@/components/markdown-content";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Report_Evidence_Confidence,
  Report_FileEvidence,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

function getColumns() {
  const columnHelper = createColumnHelper<Report_FileEvidence>();
  return [
    // file key
    columnHelper.accessor("fileKey", {
      header: "File",
      cell: ({ row }) => {
        return (
          <div className="font-mono text-balance">{row.original.fileKey}</div>
        );
      },
      meta: {
        className: "max-w-md",
      },
    }),
    columnHelper.accessor("evidence.title", {
      header: "Title",
      cell: ({ row }) => {
        return (
          <div className="text-balance">{row.original.evidence?.title}</div>
        );
      },
    }),
    columnHelper.accessor("evidence.confidence", {
      header: "Confidence",
      cell: ({ row }) => {
        return (
          <div className="text-balance">
            <ConfidenceBadge
              confidence={
                row.original.evidence?.confidence ??
                Report_Evidence_Confidence.UNSPECIFIED
              }
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("evidence.details", {
      header: "",
      cell: ({ row }) => {
        return <EvidenceDetailsSheet evidence={row.original} />;
      },
    }),
  ] as ColumnDef<Report_FileEvidence>[];
}

export default function AnalysisDataTable({
  evidences,
}: {
  evidences: Report_FileEvidence[];
}) {
  const columns = getColumns();
  return <DataTable columns={columns} data={evidences} />;
}

function EvidenceDetailsSheet({ evidence }: { evidence: Report_FileEvidence }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">View Details</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Details</SheetTitle>
          <SheetDescription className="sr-only">
            Details for {evidence.evidence?.title}
          </SheetDescription>

          <MarkdownContent
            content={evidence.evidence?.details ?? ""}
            className="text-sm/6 text-balance break-words"
          />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
