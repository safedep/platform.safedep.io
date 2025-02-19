"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/policy/data-table";
import {
  columns,
  type PolicyGroup,
} from "@/app/v2/policy-management/[groupId]/columns";
import { AttachPolicyDialog } from "./attach-policy-dialog";
import { Policy } from "@/app/v2/policy/list/actions";

interface AttachedPoliciesProps {
  attachedPolicies: PolicyGroup[];
  availablePolicies: Policy[];
  onAttach(policyIds: string[]): Promise<void>;
  onDetach(policyId: string): Promise<void>;
}

export default function AttachedPolicies({
  attachedPolicies,
  availablePolicies,
  onAttach,
  onDetach,
}: AttachedPoliciesProps) {
  // Get the IDs of currently attached policies
  const attachedPolicyIds = attachedPolicies.map((policy) => policy.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-start justify-between">
            <h1>Attached Policies</h1>
            <AttachPolicyDialog
              policies={availablePolicies}
              attachedPolicyIds={attachedPolicyIds}
              onAttach={onAttach}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns(onDetach)} data={attachedPolicies} />
      </CardContent>
    </Card>
  );
}
