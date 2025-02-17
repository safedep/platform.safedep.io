import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getPolicies } from "./actions";
import { DataTable } from "@/components/policy/data-table";
import { columns } from "./columns";

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
        <DataTable columns={columns} data={policies} />
      </div>
    </div>
  );
}
