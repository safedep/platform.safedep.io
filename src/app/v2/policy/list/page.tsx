import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getPolicies } from "./actions";

export default async function PolicyListPage() {
  const policies = await getPolicies();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Policies</h1>
        <Button asChild>
          <Link href="/v2/policy/new-policy">
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead>Rules</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell>{policy.version}</TableCell>
                <TableCell>{policy.target}</TableCell>
                <TableCell>
                  <Badge variant={policy.type ? "default" : "destructive"}>
                    {policy.type ? "Allow" : "Deny"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {policy.labels.map((label) => (
                      <Badge key={label} variant="secondary">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{policy.rulesCount} rules</TableCell>
                <TableCell>
                  <Button variant="ghost" asChild>
                    <Link href={`/v2/policy/edit/${policy.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {policies.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No policies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
