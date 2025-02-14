"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdatePolicyGroupForm, {
  type PolicyGroupFormValues,
} from "@/components/policy/update-group-form";

interface PolicyGroupData {
  name: string;
  description?: string;
}

interface PolicyGroupDetailsProps {
  data: PolicyGroupData;
  onUpdate: (values: PolicyGroupFormValues) => Promise<void>;
}

export default function PolicyGroupDetails({
  data,
  onUpdate,
}: PolicyGroupDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Policy Group details</CardTitle>
      </CardHeader>
      <CardContent>
        <UpdatePolicyGroupForm onSubmit={onUpdate} defaultValues={data} />
      </CardContent>
    </Card>
  );
}
