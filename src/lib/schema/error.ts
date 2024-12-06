import { z } from "zod";

/**
  * Error response
  * @message - The error message
  * @errors - An array of error messages
*/
export const Error = z.object({
  message: z.string().min(1, { message: "Message is required" }),
  errors: z.array(z.object({
    field: z.string().optional(),
    status: z.number().optional(),
    message: z.string().min(1, {
      message: "Error message is required"
    })
  })),
});

/**
 * Create an error response
 * @param message - The error message
 * @param errors - An array of error messages
 * @returns Error
 * @throws Error
*/
export const createError = (message: string, errors: { message: string, status?: number }[]) => {
  return Error.parse({ message, errors });
}

export const createValidationError = (error: z.ZodError | null) => {
  return Error.parse({
    message: "Validation failed",
    errors: error?.errors.map((e) => {
      return {
        field: e.path.join("."),
        message: e.message
      }
    })
  });
}
