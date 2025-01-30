import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

export default function ComponentsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">dependency-1</TableCell>
          <TableCell>v2.1.0</TableCell>
          <TableCell>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              Secure
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">dependency-2</TableCell>
          <TableCell>v1.8.3</TableCell>
          <TableCell>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              Secure
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">dependency-3</TableCell>
          <TableCell>v3.0.1</TableCell>
          <TableCell>
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
              Review Required
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
