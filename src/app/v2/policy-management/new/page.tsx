"use client";
import CreatePolicyGroupForm from "@/components/policy/create-group-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPolicyGroup } from "./actions";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const { mutateAsync: createPolicyGroupHandler } = useMutation({
    mutationKey: ["policy-groups"],
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) =>
      await createPolicyGroup({
        name,
        description,
      }),
    onSuccess: () => {
      toast.success("Policy group created");
      router.push("/v2/policy-management/manage");
    },
    onError: () => {
      toast.error("Failed to create policy group");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-groups"] });
    },
  });

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
            onSubmit={createPolicyGroupHandler}
          />
        </CardContent>
      </Card>
    </div>
  );
}
