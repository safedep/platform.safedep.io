"use client";
import CreatePolicyGroupForm from "@/components/policy/create-group-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPolicyGroup } from "./actions";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  async function onSubmit(values: { name: string; description?: string }) {
    try {
      await createPolicyGroup({
        name: values.name,
        description: values.description ?? "",
      });
      router.push("/v2/policy-management/manage");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
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
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
