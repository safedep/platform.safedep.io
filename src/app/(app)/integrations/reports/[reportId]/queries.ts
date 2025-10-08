import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  listScanComponents,
  listScanPolicyViolations,
  listScanVulnerabilities,
  PaginationParams,
} from "./actions";
import { PaginationRequest_SortOrder } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/pagination_pb";

export function getListScanComponentsQuery({
  reportId,
  tenant,
  pagination,
}: {
  reportId: string;
  tenant: string;
  pagination?: PaginationParams;
}) {
  return queryOptions({
    queryKey: [
      "list-scan-components",
      {
        reportId,
        tenant,
        pagination: {
          pageToken: pagination?.pageToken ?? "",
          pageSize: pagination?.pageSize ?? 10,
          sortOrder:
            pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
        },
      },
    ],
    queryFn: async () =>
      await listScanComponents({
        reportId,
        tenant,
        pagination: {
          pageToken: pagination?.pageToken ?? "",
          pageSize: pagination?.pageSize ?? 10,
          sortOrder:
            pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
        },
      }),
    placeholderData: keepPreviousData,
  });
}

export function getListScanPolicyViolationsQuery({
  reportId,
  tenant,
  pagination,
}: {
  reportId: string;
  tenant: string;
  pagination?: PaginationParams;
}) {
  return queryOptions({
    queryKey: [
      "list-scan-policy-violations",
      {
        reportId,
        tenant,
        pagination: {
          pageToken: pagination?.pageToken ?? "",
          pageSize: pagination?.pageSize ?? 10,
          sortOrder:
            pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
        },
      },
    ],
    queryFn: async () =>
      await listScanPolicyViolations({
        reportId,
        tenant,
        pagination: {
          pageToken: pagination?.pageToken ?? "",
          pageSize: pagination?.pageSize ?? 10,
          sortOrder:
            pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
        },
      }),
    placeholderData: keepPreviousData,
  });
}

export function getListScanVulnerabilitiesQuery({
  reportId,
  tenant,
  pagination,
}: {
  reportId: string;
  tenant: string;
  pagination?: PaginationParams;
}) {
  return queryOptions({
    queryKey: [
      "list-scan-vulnerabilities",
      {
        reportId,
        tenant,
        pagination: {
          pageToken: pagination?.pageToken ?? "",
          pageSize: pagination?.pageSize ?? 10,
          sortOrder:
            pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
        },
      },
    ],
    queryFn: async () =>
      await listScanVulnerabilities({
        reportId,
        tenant,
        pagination: {
          pageToken: pagination?.pageToken ?? "",
          pageSize: pagination?.pageSize ?? 10,
          sortOrder:
            pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
        },
      }),
    placeholderData: keepPreviousData,
  });
}
