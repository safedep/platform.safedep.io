"use client";
import { DataTable } from "@/components/policy/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { columns, type PolicyGroup } from "./columns";
import { useState } from "react";

export default function Page() {
  const [foo] = useState([
    {
      id: "1",
      name: "Admin group",
      updatedAt: new Date("1/1/2025"),
    },
    {
      id: "2",
      name: "Frontend Team",
      updatedAt: new Date("1/11/2024"),
    },
  ] as PolicyGroup[]);
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Groups</h1>
          <p className="text-muted-foreground">Manage your policy groups.</p>
        </div>
        <Button asChild>
          <Link href="/v2/policy/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Policy Group
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={foo} />
    </div>
  );
}
