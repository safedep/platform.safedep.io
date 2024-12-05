import { createValidationError } from "@/lib/schema/error";
import { OnboardingRequest, OnboardingResponse } from "@/lib/schema/onboarding";
import { validateSchema } from "@/lib/schema/validate";
import { logger } from "@/utils/logger";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const body = await req.json();

  const { validData, errors } = validateSchema(OnboardingRequest, body);
  if (!validData || errors) {
    logger.debug("Validation failed", errors);
    return NextResponse.json(createValidationError(errors), { status: 400 });
  }

  logger.debug("Onboarding request", validData);

  type responseType = z.infer<typeof OnboardingResponse>;
  const response: responseType = {
    domain: "example.com"
  };

  logger.debug("Onboarding successful", response);
  return NextResponse.json(response, { status: 200 });
}
