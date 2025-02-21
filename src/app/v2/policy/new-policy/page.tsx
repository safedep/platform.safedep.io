"use client";
import PolicyForm, { PolicyFormValues } from "@/components/policy/policy-form";
import { CreatePolicyRequestSchema } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/policy_pb";
import { create } from "@bufbuild/protobuf";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPolicy } from "./actions";

export default function Page() {
  const router = useRouter();

  const { mutateAsync: createPolicyHandler } = useMutation({
    mutationFn: async (form: PolicyFormValues) => {
      const policyRequest = create(CreatePolicyRequestSchema, { ...form });
      await createPolicy(policyRequest);
    },
    onSuccess: () => {
      toast.success("Policy created successfully");
      router.back();
    },
    onError: () => {
      toast.error("Failed to create policy");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Policy</h1>
      </div>

      <PolicyForm onSubmit={createPolicyHandler} />
    </div>
  );
}
