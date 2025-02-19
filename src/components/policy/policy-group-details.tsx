"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdatePolicyGroupForm, {
  type PolicyGroupFormValues,
} from "@/components/policy/update-group-form";

interface PolicyGroupData {
  name?: string;
  description?: string;
}

interface PolicyGroupDetailsProps {
  data: PolicyGroupData;
  onUpdate(values: PolicyGroupFormValues): Promise<void>;
  isLoading: boolean;
}

export default function PolicyGroupDetails({
  data,
  onUpdate,
  isLoading,
}: PolicyGroupDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Policy Group details</CardTitle>
      </CardHeader>
      <CardContent>
        <UpdatePolicyGroupForm
          onSubmit={onUpdate}
          defaultValues={data}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
