"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PolicyGroupDetails from "@/components/policy/policy-group-details";
import AttachedPolicies from "@/components/policy/attached-policies";
import type { PolicyGroupFormValues } from "@/components/policy/update-group-form";
import {
  attachPolicyToGroup,
  detachPolicyFromGroup,
  getPolicyGroup,
  updatePolicyGroup,
} from "./actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPolicies } from "../../policy/list/actions";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function PolicyGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  // get the policy group data
  const policyGroupQuery = useQuery({
    queryFn: () => getPolicyGroup(groupId),
    queryKey: ["policy-group", groupId],
    select({ group: { name, id, description }, policies }) {
      return {
        group: {
          name,
          id,
          description,
        },
        policies,
      };
    },
  });

  const queryClient = useQueryClient();

  // use a mutation to handle updating the policy group
  const policyGroupUpdateMutation = useMutation({
    mutationKey: ["policy-group", groupId],
    mutationFn: async (values: PolicyGroupFormValues) => {
      return await updatePolicyGroup({
        groupId,
        name: values.name,
        description: values.description,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-group", groupId] });
    },
  });

  // fetch all policies available to attach to the policy group
  const policiesQuery = useQuery({
    queryKey: ["policies"],
    queryFn: () => getPolicies(),
  });

  // use a mutation to handle attaching policies to the policy group
  const policyGroupAttachMutation = useMutation({
    mutationKey: ["policy-group", groupId],
    mutationFn: async (policyIds: string[]) => {
      const promises = [];
      for (const policyId of policyIds) {
        promises.push(attachPolicyToGroup(groupId, policyId));
      }
      await Promise.all(promises);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-group", groupId] });
    },
  });

  // use a mutation to handle detaching policies from the policy group
  const policyGroupDetachMutation = useMutation({
    mutationKey: ["policy-group", groupId],
    mutationFn: async (policyId: string) => {
      console.log("detachPolicy policyId", policyId, "groupId", groupId);
      return await detachPolicyFromGroup(groupId, policyId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-group", groupId] });
    },
  });

  async function handleUpdatePolicyGroup(values: PolicyGroupFormValues) {
    await policyGroupUpdateMutation.mutateAsync(values);
  }

  async function handleAttachPolicies(policyIds: string[]) {
    await policyGroupAttachMutation.mutateAsync(policyIds);
  }

  async function handleDetachPolicy(policyId: string) {
    await policyGroupDetachMutation.mutateAsync(policyId);
  }

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
        data={
          policyGroupQuery.data?.group ?? {
            name: "",
            id: "",
            description: "",
          }
        }
        onUpdate={handleUpdatePolicyGroup}
        isLoading={policyGroupUpdateMutation.isPending}
      />
      <AttachedPolicies
        attachedPolicies={policyGroupQuery.data?.policies ?? []}
        availablePolicies={policiesQuery.data ?? []}
        onAttach={handleAttachPolicies}
        onDetach={handleDetachPolicy}
      />
      {policyGroupDetachMutation.error?.message} = det err
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}
