"use client";
import CreatePolicyGroupForm from "@/components/policy/create-group-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Policy Group
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create new policy group</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePolicyGroupForm
            defaultValues={{ name: "", description: "" }}
            onSubmit={async (e) => console.log(e)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
