import { z } from "zod";

export const ListApiKeyRequest = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export const ListApiKeyResponse = z.object({
  keys: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      expiry: z.date().optional(),
    })
  ),
  total: z.number(),
});

export const CreateApiKeyRequest = z.object({
  name: z.string().min(3, { message: "Name should be minimum 3 chars" }),
  description: z.string().min(1, { message: "Description is required" }),
  expiryDays: z.number()
    .min(1, { message: "Expiry days is required" })
    .max(365, { message: "Expiry days must be less than 365" }),
});

export const CreateApiKeyResponse = z.object({
  id: z.string().min(1, { message: "Id is required" }),
  key: z.string().min(1, { message: "Key is required" }),
  expiry: z.date().optional(),
});

export const DeleteApiKeyRequest = z.object({
  id: z.string().min(1, { message: "Id is required" }),
});
