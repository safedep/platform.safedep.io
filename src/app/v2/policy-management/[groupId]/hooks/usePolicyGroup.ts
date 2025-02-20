import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PolicyGroupFormValues } from "@/components/policy/update-group-form";
import {
  attachPolicyToGroup,
  detachPolicyFromGroup,
  getPolicyGroup,
  updatePolicyGroup,
} from "../actions";
import { getPolicies } from "../../../policy/list/actions";

export function usePolicyGroup(groupId: string) {
  const queryClient = useQueryClient();

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

  return {
    policyGroup: policyGroupQuery.data?.group ?? {
      name: "",
      id: "",
      description: "",
    },
    attachedPolicies: policyGroupQuery.data?.policies ?? [],
    availablePolicies: policiesQuery.data ?? [],
    isUpdating: policyGroupUpdateMutation.isPending,
    updatePolicyGroup: handleUpdatePolicyGroup,
    attachPolicies: handleAttachPolicies,
    detachPolicy: handleDetachPolicy,
  };
}
