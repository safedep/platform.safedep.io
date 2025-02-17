"use client";
import { DataTable } from "@/components/policy/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { columns, PolicyGroup } from "./columns";
import { useState, useEffect } from "react";
import { listPolicyGroups } from "./actions";

export default function Page() {
  const [policyGroups, setPolicyGroups] = useState<PolicyGroup[]>([]);
  useEffect(() => {
    listPolicyGroups().then(setPolicyGroups);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Groups</h1>
          <p className="text-muted-foreground">Manage your policy groups.</p>
        </div>
        <Button asChild>
          <Link href="/v2/policy-management/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Policy Group
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={policyGroups} />
    </div>
  );
}
