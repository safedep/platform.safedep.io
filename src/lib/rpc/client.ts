import { createConnectTransport } from "@connectrpc/connect-node";
import { createClient, type Interceptor } from "@connectrpc/connect";
import { OnboardingService } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/onboarding_pb";
import { ApiKeyService } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/api_key_pb";
import { UserService } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/user_pb";
import { InsightService } from "@buf/safedep_api.bufbuild_es/safedep/services/insights/v2/insights_pb";
import { MalwareAnalysisService } from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import { TenantService } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/tenant_pb";
import { env } from "@/env";
import "server-only";

const apiBaseUrl = env.API_BASE_URL;
const cloudApiBaseUrl = env.CLOUD_API_BASE_URL;

function authenticationInterceptor(token: string, tenant: string): Interceptor {
  return (next) => async (req) => {
    req.header.set("authorization", token);
    req.header.set("x-tenant-id", tenant);
    return await next(req);
  };
}

/**
 * Create a ConnectRPC transport with authentication headers
 */
export function createTransport(apiUrl: string, tenant: string, token: string) {
  return createConnectTransport({
    baseUrl: apiUrl,
    httpVersion: "1.1",
    interceptors: [authenticationInterceptor(token, tenant)],
  });
}

export function createInsightServiceClient(tenant: string, token: string) {
  const transport = createTransport(apiBaseUrl, tenant, token);
  return createClient(InsightService, transport);
}

export function createOnboardingServiceClient(token: string) {
  const transport = createTransport(cloudApiBaseUrl, "", token);
  return createClient(OnboardingService, transport);
}

export function createApiKeyServiceClient(tenant: string, token: string) {
  const transport = createTransport(cloudApiBaseUrl, tenant, token);
  return createClient(ApiKeyService, transport);
}

export function createTenantServiceClient(tenant: string, token: string) {
  const transport = createTransport(cloudApiBaseUrl, tenant, token);
  return createClient(TenantService, transport);
}

export function createUserServiceClient(token: string) {
  const transport = createTransport(cloudApiBaseUrl, "", token);
  return createClient(UserService, transport);
}

export function createMalwareAnalysisServiceClient(
  tenant: string,
  token: string,
) {
  const transport = createTransport(apiBaseUrl, tenant, token);
  return createClient(MalwareAnalysisService, transport);
}

export async function getUserAccess(token: string) {
  const userServiceClient = createUserServiceClient(token);
  return await userServiceClient.getUserInfo({});
}

/**
 * Find the first tenant associated with the user
 */
export async function findFirstUserAccess(token: string) {
  const userServiceClient = createUserServiceClient(token);
  const userInfo = await userServiceClient.getUserInfo({});

  if (userInfo.access.length === 0) {
    throw new Error("User has no access to any tenant");
  }

  return userInfo.access[0];
}
