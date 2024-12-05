import { z } from "zod";

export const OnboardingRequest = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  organizationName: z.string().min(1, { message: "Organization name is required" }),
  organizationDomain: z.string().min(1, { message: "Organization domain is required" }),
});

export const OnboardingResponse = z.object({
  domain: z.string().min(1, { message: "Domain is required" }),
});


