"use client";

import { useRouter } from "next/navigation";
import PolicyForm, { PolicyFormValues } from "@/components/policy/policy-form";

export default function EditPolicyPage() {
  const router = useRouter();

  // TODO: Replace with actual data fetching
  const defaultValues: PolicyFormValues = {
    name: "Security Policy",
    version: "v1",
    target: "vet",
    type: true,
    labels: ["security", "production"],
    rules: [],
  };

  const handleSubmit = async (values: PolicyFormValues) => {
    try {
      // TODO: Implement policy update
      console.log("Updating policy:", values);
      router.push("/v2/policy/list");
    } catch (error) {
      console.error("Failed to update policy:", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Policy</h1>
        <p className="text-muted-foreground">Update an existing policy</p>
      </div>

      <PolicyForm
        mode="update"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
