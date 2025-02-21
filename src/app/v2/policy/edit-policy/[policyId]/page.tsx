"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PolicyForm, { PolicyFormValues } from "@/components/policy/policy-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPolicy, updatePolicy } from "./actions";
import { PolicyVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { PolicyTarget } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { PolicyType } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { toast } from "sonner";

export default function EditPolicyPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const router = useRouter();

  const {
    data: policy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["policy", policyId],
    queryFn: () => getPolicy(policyId),
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updatePolicyHandler } = useMutation({
    mutationKey: ["policy", policyId],
    mutationFn: (values: PolicyFormValues) => updatePolicy(policyId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policy", policyId] });
      toast.success("Policy updated");
    },
    onError: () => {
      toast.error("Failed to update policy", {
        description: "Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy", policyId] });
    },
  });

  if (isLoading) {
    // TODO: Show loading spinner
    return <div>Loading...</div>;
  }
  if (error) {
    // TODO: Show error message
    return <div>Error: {error.message}</div>;
  }
  if (!policy) {
    // TODO: show error message
    return <div>Policy not found</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Policy</h1>
          <p className="text-sm text-muted-foreground">Policy ID: {policyId}</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      <PolicyForm
        mode="update"
        onSubmit={updatePolicyHandler}
        defaultValues={{
          name: policy.name ?? "",
          version: policy.version ?? PolicyVersion.UNSPECIFIED,
          target: policy.target ?? PolicyTarget.UNSPECIFIED,
          type: policy.type ?? PolicyType.UNSPECIFIED,
          labels: policy.labels ?? [],
          rules: policy.rules ?? [],
        }}
      />
    </div>
  );
}
