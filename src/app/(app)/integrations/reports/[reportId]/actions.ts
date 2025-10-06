"use server";
import { createScanServiceClient } from "@/lib/rpc/client";
import { getSessionOrRedirectToAuth } from "@/lib/session/session";
import { PaginationRequest_SortOrder } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/pagination_pb";

async function getScanServiceClient({
  reportId,
  tenant,
}: {
  reportId: string;
  tenant: string;
}) {
  const session = await getSessionOrRedirectToAuth(
    encodeURIComponent(`/integrations/reports/${reportId}?tenant=${tenant}`),
  );
  return createScanServiceClient(tenant, session.tokenSet.accessToken);
}

export async function getScan({
  reportId,
  tenant,
}: {
  reportId: string;
  tenant: string;
}) {
  const service = await getScanServiceClient({ reportId, tenant });

  return await service.getScan({
    scanSessionId: { sessionId: reportId },
  });
}

type PaginationParams = {
  pageToken?: string;
  pageSize?: number;
  sortOrder?: PaginationRequest_SortOrder;
};

export async function listScanComponents({
  reportId,
  tenant,
  pagination,
}: {
  reportId: string;
  tenant: string;
  pagination?: PaginationParams;
}) {
  const service = await getScanServiceClient({ reportId, tenant });
  return await service.listScanComponents({
    scanSessionId: { sessionId: reportId },
    pagination: {
      pageToken: pagination?.pageToken ?? "",
      pageSize: pagination?.pageSize ?? 10,
      sortOrder:
        pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
    },
  });
}

export async function listScanPolicyViolations({
  reportId,
  tenant,
  pagination,
}: {
  reportId: string;
  tenant: string;
  pagination?: PaginationParams;
}) {
  const service = await getScanServiceClient({ reportId, tenant });
  return await service.listScanPolicyViolations({
    scanSessionId: { sessionId: reportId },
    pagination: {
      pageToken: pagination?.pageToken ?? "",
      pageSize: pagination?.pageSize ?? 10,
      sortOrder:
        pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
    },
  });
}

export async function listScanVulnerabilities({
  reportId,
  tenant,
  pagination,
}: {
  reportId: string;
  tenant: string;
  pagination?: PaginationParams;
}) {
  const service = await getScanServiceClient({ reportId, tenant });
  return await service.listScanVulnerabilities({
    scanSessionId: { sessionId: reportId },
    pagination: {
      pageToken: pagination?.pageToken ?? "",
      pageSize: pagination?.pageSize ?? 10,
      sortOrder:
        pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
    },
  });
}
