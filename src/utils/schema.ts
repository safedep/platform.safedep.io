import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  organizationName: z.string().min(1, { message: "Organization name is required" }),
  organizationDomain: z
    .string()
    .regex(
      /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      { message:  "Organization domain must be a valid domain" }
    ),
});

export function validateSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { validData: z.infer<T> | null; errors: z.ZodIssue[] | null } {
  try {
    return { validData: schema.parse(data), errors: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { validData: null, errors: err.errors };
    }
    throw err; 
  }
}
