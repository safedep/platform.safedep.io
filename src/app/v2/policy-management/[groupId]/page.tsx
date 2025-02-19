"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PolicyGroupDetails from "@/components/policy/policy-group-details";
import AttachedPolicies from "@/components/policy/attached-policies";
import type { PolicyGroupFormValues } from "@/components/policy/update-group-form";
import type { PolicyGroup } from "./columns";
import {
  PolicyTarget,
  PolicyType,
  PolicyVersion,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import {
  attachPolicyToGroup,
  detachPolicyFromGroup,
  getPolicyGroup,
  updatePolicyGroup,
} from "./actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Function to generate mock policies with deterministic values
function generateMockPolicies(count: number) {
  const policyTypes = [
    "Security",
    "Maintenance",
    "Compliance",
    "Performance",
    "Quality",
    "License",
    "Dependency",
  ];
  const targets = [PolicyTarget.VET];
  const versions = [PolicyVersion.V1, PolicyVersion.V2];
  const labelSets = [
    ["security", "production"],
    ["development", "testing"],
    ["critical", "high"],
    ["medium", "low"],
    ["internal", "external"],
    ["compliance", "audit"],
    ["performance", "quality"],
    ["frontend", "backend"],
    ["infrastructure", "database"],
    ["network", "security"],
  ];

  return Array.from({ length: count }, (_, index) => {
    const typeIndex = index % policyTypes.length;
    const labelSetIndex = index % labelSets.length;
    const versionIndex = index % versions.length;
    const isAllow = index % 3 !== 0 ? PolicyType.ALLOW : PolicyType.DENY; // Every third policy is deny

    return {
      id: `policy-${index + 1}`,
      name: `${policyTypes[typeIndex]} Policy ${index + 1}`,
      version: versions[versionIndex],
      target: targets[0],
      type: isAllow,
      labels: labelSets[labelSetIndex],
      rulesCount: (index % 5) + 1, // 1 to 5 rules
    };
  });
}

export default function PolicyGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  // Generate mock policies with deterministic values
  const [allMockPolicies] = useState(() => generateMockPolicies(2000));

  // Take first 5 policies as attached (deterministic selection)
  const [attachedPolicies] = useState<PolicyGroup[]>(() => {
    const selectedPolicies = allMockPolicies.slice(0, 5).map((policy) => ({
      id: policy.id,
      name: policy.name,
      updatedAt: new Date("2024-01-01"), // Fixed date for deterministic behavior
    }));
    return selectedPolicies;
  });

  // Use all mock policies as available policies
  const [availablePolicies] = useState(() => allMockPolicies);

  // get the policy group data
  const { data: policyGroup, isFetching: isFetchingPolicyGroup } = useQuery({
    queryFn: () =>
      getPolicyGroup(groupId)
        .then((x) => x.group)
        .then((x) => ({
          name: x?.name ?? "",
          description: x?.description ?? "",
        })),
    queryKey: ["policy-group", groupId],
    placeholderData: {
      name: "",
      description: "",
    },
  });

  const queryClient = useQueryClient();
  // use a mutation to handle updating the policy group
  const { mutate: updateGroup, isPending: isUpdatingPolicyGroup } = useMutation(
    {
      mutationKey: ["policy-group", groupId],
      mutationFn: async (values: PolicyGroupFormValues) => {
        console.log("updateGroup", values);
        return await updatePolicyGroup({
          groupId,
          name: values.name,
          description: values.description,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["policy-group", groupId] });
      },
    },
  );

  async function handleUpdateGroup(values: PolicyGroupFormValues) {
    updateGroup(values);
  }

  async function handleAttachPolicies(policyIds: string[]) {
    const promises = [];
    for (const policyId of policyIds) {
      promises.push(attachPolicyToGroup(groupId, policyId));
    }
    await Promise.all(promises);
  }

  async function handleDetachPolicy(policyId: string) {
    await detachPolicyFromGroup(groupId, policyId);
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
        data={policyGroup ?? { name: "", description: "" }}
        onUpdate={handleUpdateGroup}
        isLoading={isUpdatingPolicyGroup || isFetchingPolicyGroup}
      />

      <AttachedPolicies
        attachedPolicies={attachedPolicies}
        availablePolicies={availablePolicies}
        onAttach={handleAttachPolicies}
        onDetach={handleDetachPolicy}
      />
    </div>
  );
}
