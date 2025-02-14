"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PolicyGroupDetails from "@/components/policy/policy-group-details";
import AttachedPolicies from "@/components/policy/attached-policies";
import type { PolicyGroupFormValues } from "@/components/policy/update-group-form";
import type { Policy } from "./columns";

// Function to generate mock policies
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
  const labelPool = [
    "security",
    "production",
    "development",
    "testing",
    "critical",
    "high",
    "medium",
    "low",
    "internal",
    "external",
    "compliance",
    "audit",
    "performance",
    "quality",
    "license",
    "frontend",
    "backend",
    "infrastructure",
    "database",
    "network",
  ];

  return Array.from({ length: count }, (_, index) => {
    const type = policyTypes[Math.floor(Math.random() * policyTypes.length)];
    const randomLabels = Array.from(
      { length: Math.floor(Math.random() * 4) + 1 },
      () => labelPool[Math.floor(Math.random() * labelPool.length)],
    );
    const uniqueLabels = Array.from(new Set(randomLabels));

    return {
      id: `policy-${index + 1}`,
      name: `${type} Policy ${index + 1}`,
      version: versions[Math.floor(Math.random() * versions.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      type: Math.random() > 0.3,
      labels: uniqueLabels,
      rulesCount: Math.floor(Math.random() * 10) + 1,
    };
  });
}

export default function PolicyGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  // TODO: get policies from API
  const [attachedPolicies] = useState<Policy[]>([
    {
      id: "1",
      name: "policy-1",
      updatedAt: new Date("1/1/2025"),
    },
    {
      id: "2",
      name: "policy-2",
      updatedAt: new Date("1/2/2024"),
    },
  ]);

  // Generate 2000 mock policies
  const [availablePolicies] = useState(() => generateMockPolicies(2000));

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
