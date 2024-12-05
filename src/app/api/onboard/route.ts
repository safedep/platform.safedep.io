import { createOnboardingServiceClient } from "@/lib/rpc/client";
import { createValidationError } from "@/lib/schema/error";
import { OnboardingRequest, OnboardingResponse } from "@/lib/schema/onboarding";
import { validateSchema } from "@/lib/schema/validate";
import { logger } from "@/utils/logger";
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const { accessToken } = await getAccessToken();

  const body = await req.json();
  const onboardingService = createOnboardingServiceClient(accessToken as string);

  const { validData, errors } = validateSchema(OnboardingRequest, body);
  if (!validData || errors) {
    logger.debug("Validation failed", errors);
    return NextResponse.json(createValidationError(errors), { status: 400 });
  }

  logger.debug("Onboarding request", validData);

  const { tenant } = await onboardingService.onboardUser({
    organizationName: validData.organizationName,
    organizationDomain: validData.organizationDomain,
    name: validData.name,
  })

  logger.debug("Response from onboarding service", tenant)

  type responseType = z.infer<typeof OnboardingResponse>;
  const response: responseType = {
    domain: tenant?.domain as string,
  };

  logger.debug("Onboarding successful", response);
  return NextResponse.json(response, { status: 200 });
}
