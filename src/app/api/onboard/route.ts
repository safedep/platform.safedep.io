import { NextResponse } from "next/server";
import { onboardingSchema, validateSchema } from "@/utils/schema";
import { logger } from "@/utils/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { validData, errors } = validateSchema(onboardingSchema, body);

    if (!validData || errors) {
      logger.error("Validation failed");
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    logger.info("Onboarding data received", validData);

    return NextResponse.json({
      success: true,
      message: "Tenant created successfully",
    });
  } catch (err) {
    logger.error("Unexpected error", { error: (err as Error).message });
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
