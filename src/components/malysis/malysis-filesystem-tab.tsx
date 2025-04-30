import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import type { Report_File } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";

export default function MalysisFilesystemTable({
  files,
}: {
  files: Report_File[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%]">File</TableHead>
          <TableHead>Size (in bytes)</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.key}>
            <TableCell className="font-mono">{file.key}</TableCell>
            <TableCell>{file.size.toLocaleString()}</TableCell>
            <TableCell>
              {file.mimeType || file.derivedExtension || "unknown"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
