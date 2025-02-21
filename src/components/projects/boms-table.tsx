import { BOM_Status } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/bom_pb";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import type { BOMWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import { timestampDate } from "@bufbuild/protobuf/wkt";

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

export default function BOMSTable({ boms }: { boms: BOMWithAttributes[] }) {
  return (
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
              {bom?.createdAt
                ? timestampDate(bom.createdAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </TableCell>
            <TableCell>{getBOMStatusName(bom?.status)}</TableCell>
            <TableCell>
              {bom?.updatedAt
                ? timestampDate(bom.updatedAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
