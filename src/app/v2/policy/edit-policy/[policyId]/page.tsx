"use client";

import { redirect, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import PolicyForm, { PolicyFormValues } from "@/components/policy/policy-form";
import { useQuery } from "@tanstack/react-query";
import { getPolicy, updatePolicy } from "./actions";
import router from "next/router";
import { PolicyVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { PolicyTarget } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { PolicyType } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";

export default function EditPolicyPage() {
  const { policyId } = useParams<{ policyId: string }>();

  const {
    data: policy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["policy", policyId],
    queryFn: () => getPolicy(policyId),
  });

  async function handleSubmit(values: PolicyFormValues) {
    await updatePolicy(policyId, values);
    redirect("/v2/policy/list");
  }

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Policy</h1>
          <p className="text-muted-foreground">Policy ID: {policyId}</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      <PolicyForm
        defaultValues={{
          name: policy.name,
          version: policy.version ?? PolicyVersion.UNSPECIFIED,
          target: policy.target ?? PolicyTarget.UNSPECIFIED,
          policyType: policy.policyType ?? PolicyType.UNSPECIFIED,
          labels: policy.labels,
          rules: policy.rules,
        }}
        mode="update"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
