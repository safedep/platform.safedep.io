import { apiErrorHandler } from "@/lib/api/error";
import { createApiKeyServiceClient } from "@/lib/rpc/client";
import {
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  DeleteApiKeyRequest,
  ListApiKeyResponse,
} from "@/lib/schema/apikey";
import { createValidationError } from "@/lib/schema/error";
import { validateSchema } from "@/lib/schema/validate";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { timestampDate } from "@bufbuild/protobuf/wkt";

async function handleListApiKeys() {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();

  const client = createApiKeyServiceClient(tenant, accessToken as string);
  const keys = await client.listApiKeys({});

  type responseType = z.infer<typeof ListApiKeyResponse>;
  const response: responseType = {
    keys: keys.keys.map((key) => ({
      id: key.keyId,
      name: key.name,
      description: key.description,
      expiry: key.expiresAt ? timestampDate(key.expiresAt) : undefined,
    })),
    total: keys.keys.length,
  };

  return NextResponse.json(response);
}

async function handleCreateApiKey(req: NextRequest) {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();

  const { validData, errors } = validateSchema(
    CreateApiKeyRequest,
    await req.json(),
  );
  if (!validData || errors) {
    return NextResponse.json(createValidationError(errors), { status: 400 });
  }

  const client = createApiKeyServiceClient(tenant, accessToken as string);
  const response = await client.createApiKey({
    name: validData.name,
    description: validData.description,
    expiryDays: validData.expiryDays,
  });

  type responseType = z.infer<typeof CreateApiKeyResponse>;
  const responseBody: responseType = {
    id: response.keyId,
    key: response.key,
    expiry: response.expiresAt ? timestampDate(response.expiresAt) : undefined,
  };

  return NextResponse.json(responseBody, { status: 201 });
}

async function handleDeleteApiKey(req: NextRequest) {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();

  const { validData, errors } = validateSchema(
    DeleteApiKeyRequest,
    await req.json(),
  );
  if (!validData || errors) {
    return NextResponse.json(createValidationError(errors), { status: 400 });
  }

  const client = createApiKeyServiceClient(tenant, accessToken as string);
  await client.deleteApiKey({ keyId: validData.id });

  return NextResponse.json({});
}

export const GET = apiErrorHandler(handleListApiKeys);
export const POST = apiErrorHandler(handleCreateApiKey);
export const DELETE = apiErrorHandler(handleDeleteApiKey);
