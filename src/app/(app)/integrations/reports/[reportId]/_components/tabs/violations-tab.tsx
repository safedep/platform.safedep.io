"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getListScanPolicyViolationsQuery } from "../../queries";

export default function ViolationsTab({
  reportId,
  tenant,
}: {
  reportId: string;
  tenant: string;
}) {
  const { data } = useSuspenseQuery({
    ...getListScanPolicyViolationsQuery({
      reportId,
      tenant,
    }),
  });
  return <div>ViolationsTab {data.policyViolations.length}</div>;
}
