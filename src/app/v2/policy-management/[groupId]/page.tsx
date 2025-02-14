"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PolicyGroupDetails from "@/components/policy/policy-group-details";
import AttachedPolicies from "@/components/policy/attached-policies";
import type { PolicyGroupFormValues } from "@/components/policy/update-group-form";
import type { Policy } from "./columns";

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
  const targets = ["vet"];
  const versions = ["v1", "v2"];
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
    const isAllow = index % 3 !== 0; // Every third policy is deny

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
  const [attachedPolicies] = useState<Policy[]>(() => {
    const selectedPolicies = allMockPolicies.slice(0, 5).map((policy) => ({
      id: policy.id,
      name: policy.name,
      updatedAt: new Date("2024-01-01"), // Fixed date for deterministic behavior
    }));
    return selectedPolicies;
  });

  // Use all mock policies as available policies
  const [availablePolicies] = useState(() => allMockPolicies);

  // TODO: get policy group data from API
  const [policyGroupData, setPolicyGroupData] = useState({
    name: "Policy Group 1",
    description: "This is a description" as string | undefined,
  });

  async function handleUpdateGroup(values: PolicyGroupFormValues) {
    try {
      // TODO: Implement group update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPolicyGroupData({
        description: values.description,
        name: values.name,
      });
      console.log("Updating group:", values);
    } catch (error) {
      console.error("Failed to update group:", error);
      throw error;
    }
  }

  async function handleAttachPolicies(policyIds: string[]) {
    try {
      // TODO: Implement batch policy attachment
      console.log("Attaching policies:", policyIds, "to group:", groupId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to attach policies:", error);
      throw error;
    }
  }

  async function handleDetachPolicy(policyId: string) {
    try {
      // TODO: Implement policy detachment
      console.log("Detaching policy:", policyId, "from group:", groupId);
    } catch (error) {
      console.error("Failed to detach policy:", error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Policy Group {groupId}
          </h1>
          <Button variant="secondary" onClick={router.back}>
            Go Back
          </Button>
        </div>
        <p className="text-muted-foreground">View or edit your policy group.</p>
      </div>

      <PolicyGroupDetails data={policyGroupData} onUpdate={handleUpdateGroup} />

      <AttachedPolicies
        groupId={groupId}
        attachedPolicies={attachedPolicies}
        availablePolicies={availablePolicies}
        onAttach={handleAttachPolicies}
        onDetach={handleDetachPolicy}
      />
    </div>
  );
}
