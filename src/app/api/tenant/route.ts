import { apiErrorHandler } from "@/lib/api/error";
import { getUserAccess } from "@/lib/rpc/client";
import { Tenant } from "@/lib/schema/tenant";
import { sessionSetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
  * Set the tenant domain in the session for use
  * by the application
  */
async function handleSetTenant(req: NextRequest) {
  const { domain } = await req.json()
  sessionSetTenant(domain)

  return NextResponse.json({})
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handleListTenants(_req: NextRequest) {
  const { accessToken } = await getAccessToken()

  const response = new Array<z.infer<typeof Tenant>>()
  const accesses = await getUserAccess(accessToken as string)

  for (const access of accesses.access) {
    const validatedResponse = Tenant.parse({
      domain: access.tenant?.domain as string,
      access: access.role,
    })

    response.push({
      domain: validatedResponse.domain,
      access: validatedResponse.access,
    })
  }

  return NextResponse.json(response)
}

export const POST = apiErrorHandler(handleSetTenant);
export const GET = apiErrorHandler(handleListTenants);
