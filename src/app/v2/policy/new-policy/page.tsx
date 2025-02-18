import PolicyForm, { PolicyFormValues } from "@/components/policy/policy-form";
import { createPolicy } from "./actions";
import { CreatePolicyRequest } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/policy_pb";
import { redirect } from "next/navigation";

export default async function Page() {
  async function submitHandler(form: PolicyFormValues) {
    "use server";
    const policyRequest = new CreatePolicyRequest({
      labels: form.labels ?? [],
      name: form.name,
      target: form.target,
      type: form.policyType,
      version: form.version,
      rules: form.rules,
    });

    try {
      await createPolicy(policyRequest);
    } catch {
      // TODO(arunanshub): render sonner
    }
    redirect("/v2/policy/list");
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Policy</h1>
      </div>

      <PolicyForm onSubmit={submitHandler} />
    </div>
  );
}
