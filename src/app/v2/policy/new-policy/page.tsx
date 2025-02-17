import PolicyForm, { PolicyFormValues } from "@/components/policy/policy-form";
import { createPolicy } from "./actions";
import {
  PolicyTarget,
  PolicyType,
  PolicyVersion,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { RuleCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/rule_pb";
import { CreatePolicyRequest } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/policy_pb";
import { redirect } from "next/navigation";

const ruleCheckMap = {
  License: RuleCheck.LICENSE,
  Maintenance: RuleCheck.MAINTENANCE,
  Provenance: RuleCheck.PROVENANCE,
  Vulnerability: RuleCheck.VULNERABILITY,
  Malware: RuleCheck.MALWARE,
  Popularity: RuleCheck.POPULARITY,
};

const policyTargetMap = {
  Unspecified: PolicyTarget.UNSPECIFIED,
  Vet: PolicyTarget.VET,
};

const policyVersionMap = {
  v1: PolicyVersion.V1,
  v2: PolicyVersion.V2,
};

export default async function Page() {
  async function submitHandler(form: PolicyFormValues) {
    "use server";
    console.log(form);
    const policyRequest = new CreatePolicyRequest({
      labels: form.labels ?? [],
      name: form.name,
      target: policyTargetMap[form.target],
      type: form.policyType ? PolicyType.ALLOW : PolicyType.DENY,
      version: policyVersionMap[form.version],
      rules: form.rules.map((rule) => ({
        check: ruleCheckMap[rule.check],
        name: rule.name,
        value: rule.value,
        description: rule.description,
        labels: rule.labels,
        references: rule.references ?? [],
      })),
    });

    await createPolicy(policyRequest);
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
