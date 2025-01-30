import type { ComponentWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

export default function ComponentsTable({
  components,
}: {
  components: ComponentWithAttributes[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Ecosystem</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {components.map(({ component }) => (
          <TableRow key={component?.componentId}>
            <TableCell className="font-medium">{component?.name}</TableCell>
            <TableCell>{component?.version}</TableCell>
            <TableCell>{component?.ecosystem}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
