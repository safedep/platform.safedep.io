import { apiErrorHandler } from "@/lib/api/error";
import { createOnboardingServiceClient } from "@/lib/rpc/client";
import { createValidationError } from "@/lib/schema/error";
import { OnboardingRequest, OnboardingResponse } from "@/lib/schema/onboarding";
import { validateSchema } from "@/lib/schema/validate";
import { logger } from "@/utils/logger";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { z } from "zod";

async function handleOnboarding(req: Request) {
  const { accessToken } = await getAccessToken();
  const session = await getSession();

  const body = await req.json();
  const onboardingService = createOnboardingServiceClient(
    accessToken as string,
  );

  const { validData, errors } = validateSchema(OnboardingRequest, body);
  if (!validData || errors) {
    logger.debug("Validation failed", errors);
    return NextResponse.json(createValidationError(errors), { status: 400 });
  }

  logger.debug(
    `Onboarding request email: ${session?.user.email} data: `,
    validData,
  );

  const { tenant } = await onboardingService.onboardUser({
    organizationName: validData.organizationName,
    organizationDomain: validData.organizationDomain,
    name: validData.name,
    email: session?.user.email as string,
  });

  logger.debug("Response from onboarding service", tenant);

  type responseType = z.infer<typeof OnboardingResponse>;
  const response: responseType = {
    domain: tenant?.domain as string,
  };

  logger.debug("Onboarding successful", response);
  return NextResponse.json(response, { status: 200 });
}

export const POST = apiErrorHandler(handleOnboarding);
