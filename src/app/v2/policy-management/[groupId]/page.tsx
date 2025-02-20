"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PolicyGroupDetails from "@/components/policy/policy-group-details";
import AttachedPolicies from "@/components/policy/attached-policies";
import { usePolicyGroup } from "./hooks/usePolicyGroup";

export default function PolicyGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const {
    policyGroup,
    attachedPolicies,
    availablePolicies,
    isUpdating,
    updatePolicyGroup,
    attachPolicies,
    detachPolicy,
  } = usePolicyGroup(groupId);

  return (
    <div className="container mx-auto flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            <div className="flex items-center gap-2">
              <span>Manage Policy Group</span>
            </div>
          </h1>
          <Button variant="secondary" onClick={router.back}>
            Go Back
          </Button>
        </div>
        <p className="text-muted-foreground">View or edit your policy group.</p>
      </div>
      <PolicyGroupDetails
        data={policyGroup}
        onUpdate={updatePolicyGroup}
        isLoading={isUpdating}
      />
      <AttachedPolicies
        attachedPolicies={attachedPolicies}
        availablePolicies={availablePolicies}
        onAttach={attachPolicies}
        onDetach={detachPolicy}
      />
    </div>
  );
}
