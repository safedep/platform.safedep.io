import { z } from "zod";

export function validateSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { validData: z.infer<T> | null; errors: z.ZodError | null } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { validData: result.data, errors: null };
  } else {
    return { validData: null, errors: result.error };
  }
}
