import PolicyForm, { PolicyFormValues } from "@/components/policy/policy-form";
import { createPolicy } from "./actions";
import { CreatePolicyRequest } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/policy_pb";
import { redirect } from "next/navigation";

export default async function Page() {
  async function submitHandler(form: PolicyFormValues) {
    "use server";
    const policyRequest = new CreatePolicyRequest({ ...form });
    try {
      await createPolicy(policyRequest);
      console.log(policyRequest);
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
