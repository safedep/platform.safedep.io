import { enumFromJson, isEnumJson } from "@bufbuild/protobuf";
import {
  Ecosystem,
  EcosystemSchema,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import * as v from "valibot";

/**
 * Split catch-all route segments into a package name and version without mutating input.
 * Accepts names that can contain "/" (e.g., "@scope/pkg", "github.com/org/repo").
 * The last segment is treated as the version; the rest, joined by "/", is the name.
 */
function parseNameAndVersion(segments: string[]) {
  const version = segments.at(-1);
  if (!version) {
    return undefined;
  }
  const name = segments.slice(0, -1).join("/");
  return {
    name: decodeURIComponent(name),
    version: decodeURIComponent(version),
  };
}

export const schema = v.object({
  ecosystem: v.pipe(v.string(), v.transform(parseEcosystem), v.enum(Ecosystem)),
  nameAndVersion: v.nonNullish(
    v.pipe(
      v.array(v.pipe(v.string(), v.trim(), v.minLength(1))),
      v.minLength(2),
      // In case any empty segments slipped through, normalize then re-validate
      // length For example: /a//b/c -> /a/b/c. Although this isn't really
      // needed since nextjs already does this.
      v.transform((segments) => segments.filter((s) => s.length > 0)),
      v.minLength(2),
      v.transform(parseNameAndVersion),
    ),
  ),
});

export type ParamSchema = v.InferInput<typeof schema>;

export function parseEcosystem(ecosystem: string) {
  if (isEnumJson(EcosystemSchema, ecosystem)) {
    return enumFromJson(EcosystemSchema, ecosystem);
  }
  return undefined;
}

export function parseSchema(data: ParamSchema) {
  const { success, output } = v.safeParse(schema, data);
  if (!success) {
    return undefined;
  }

  return output;
}
