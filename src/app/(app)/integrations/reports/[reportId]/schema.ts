import * as v from "valibot";

export const tenantSchema = v.object({
  tenant: v.pipe(v.string(), v.nonEmpty()),
});

export type QueryParamSchema = v.InferInput<typeof tenantSchema>;

export function parseQueryParams(data: QueryParamSchema) {
  const { success, output } = v.safeParse(tenantSchema, data);
  if (!success) {
    return undefined;
  }

  return output;
}
