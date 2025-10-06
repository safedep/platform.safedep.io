"use client";
import { useQuery } from "@tanstack/react-query";
import { getListScanPolicyViolationsQuery } from "../../queries";

export default function ViolationsTab({
  reportId,
  tenant,
}: {
  reportId: string;
  tenant: string;
}) {
  const { data } = useQuery({
    ...getListScanPolicyViolationsQuery({
      reportId,
      tenant,
    }),
  });
  return <div>ViolationsTab {data?.policyViolations.length}</div>;
}
