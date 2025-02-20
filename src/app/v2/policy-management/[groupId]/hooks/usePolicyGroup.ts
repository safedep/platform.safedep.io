import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PolicyGroupFormValues } from "@/components/policy/update-group-form";
import {
  attachPolicyToGroup,
  detachPolicyFromGroup,
  getPolicyGroup,
  updatePolicyGroup,
} from "../actions";
import { getPolicies } from "@/app/v2/policy/list/actions";
import { toast } from "sonner";

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

  // fetch all policies available to attach to the policy group
  const policiesQuery = useQuery({
    queryKey: ["policies"],
    queryFn: () => getPolicies(),
  });

  // use a mutation to handle updating the policy group
  const policyGroupUpdateMutation = useMutation({
    mutationKey: ["policy-group", groupId],
    mutationFn: async (values: PolicyGroupFormValues) => {
      await updatePolicyGroup({
        groupId,
        name: values.name,
        description: values.description,
      });
    },
    onSuccess: () => {
      toast.success("Policy group updated");
    },
    onError: () => {
      toast.error("Failed to update policy group", {
        description: "Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-group", groupId] });
    },
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
    onSuccess: () => {
      toast.success("Policies attached", {
        description: "The policies have been attached to the policy group.",
      });
    },
    onError: () => {
      toast.error("Failed to attach policies", {
        description: "Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
  });

  // use a mutation to handle detaching policies from the policy group
  const policyGroupDetachMutation = useMutation({
    mutationKey: ["policy-group", groupId],
    mutationFn: async (policyId: string) => {
      return await detachPolicyFromGroup(groupId, policyId);
    },
    onSuccess: () => {
      toast.success("Policy detached", {
        description: "The policy has been detached from the policy group.",
      });
    },
    onError: () => {
      toast.error("Failed to detach policy", {
        description: "Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["policies"] });
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
