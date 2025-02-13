"use client";

import { DataTable } from "@/components/policy/data-table";
import { columns, type Policy } from "./columns";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdatePolicyGroupForm, {
  type PolicyGroupFormValues,
} from "@/components/policy/update-group-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { groupId } = useParams<{ groupId: string }>();

  // TODO: get policies from API
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

  // TODO: get policy group data from API
  const [policyGroupData, setPolicyGroupData] = useState({
    name: "Policy Group 1",
    description: "This is a description" as string | undefined,
  });

  const router = useRouter();

  async function onSubmit(values: PolicyGroupFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPolicyGroupData({ description: values.description, name: values.name });
    console.log(values);
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Policy Group {groupId}
          </h1>
          <Button variant="secondary" onClick={router.back}>
            Go Back
          </Button>
        </div>
        <p className="text-muted-foreground">View or edit your policy group.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Policy Group details</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdatePolicyGroupForm
            onSubmit={onSubmit}
            defaultValues={policyGroupData}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-start justify-between">
              <h1>Policies in Policy Group {groupId}</h1>
              <Button asChild>
                {/* TODO: the policy group id should be passed in the url */}
                <Link href="/v2/policy/new-policy">Add Policy</Link>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
