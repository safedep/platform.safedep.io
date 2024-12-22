import { z } from "zod";

export const Tenant = z.object({
  domain: z.string().min(1, {
    message: "Domain is required",
  }),
  access: z.bigint(),
});
