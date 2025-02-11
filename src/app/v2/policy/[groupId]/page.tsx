"use client";

import { DataTable } from "@/components/policy/data-table";
import { columns, type Policy } from "./columns";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PolicyGroupForm, {
  type PolicyGroupFormValues,
} from "@/components/policy/group-form";

export default function Page() {
  const { groupId } = useParams<{ groupId: string }>();
  const [data] = useState<Policy[]>([
    {
      id: "1",
      name: "policy-1",
      updatedAt: new Date("1/1/2025"),
    },
    {
      id: "2",
      name: "policy-2",
      updatedAt: new Date("1/2/2024"),
    },
  ]);

  function onSubmit(values: PolicyGroupFormValues) {
    console.log(values);
  }

  return (
    <div className="container mx-auto py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Policy Group {groupId}
          </h1>
          <p className="text-muted-foreground">
            View or edit your policy group.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Policy Group details</CardTitle>
        </CardHeader>
        <CardContent>
          <PolicyGroupForm onSubmit={onSubmit} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Policies attached to the group</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
