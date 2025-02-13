"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreatePolicyForm, {
  CreatePolicyFormValues,
} from "@/components/policy/create-policy-form";

// Mock data for demonstration
const mockPolicyData: CreatePolicyFormValues = {
  name: "Sample Policy",
  version: "v2",
  target: "vet",
  type: true,
  labels: ["security", "compliance"],
  rules: [
    {
      name: "License Check",
      description: "Checks for compatible licenses",
      check: "License",
      value: "MIT",
      references: [{ url: "https://opensource.org/licenses/MIT" }],
      labels: ["license", "legal"],
    },
    {
      name: "Vulnerability Check",
      description: "Checks for known vulnerabilities",
      check: "Vulnerability",
      value: "HIGH",
      references: [],
      labels: ["security"],
    },
  ],
};

export default function EditPolicyPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [policyData, setPolicyData] = useState<CreatePolicyFormValues | null>(
    null,
  );

  useEffect(() => {
    // Simulate API call to fetch policy data
    async function fetchPolicyData() {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPolicyData(mockPolicyData);
      } catch (error) {
        console.error("Failed to fetch policy data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPolicyData();
  }, [policyId]);

  async function handleSubmit(values: CreatePolicyFormValues) {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating policy:", policyId, values);
    // After successful update, you might want to:
    // 1. Show a success message
    // 2. Redirect back to the policies list
    // 3. Refresh the data
    router.back();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!policyData) {
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

      <CreatePolicyForm
        defaultValues={policyData}
        mode="update"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
