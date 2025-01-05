import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { PackageVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_pb";

export function packageRegistryUrl(
  p: PackageVersion | null | undefined,
): string {
  if (!p?.package) {
    return "#";
  }

  switch (p.package?.ecosystem) {
    case Ecosystem.NPM:
      return `https://www.npmjs.com/package/${p.package?.name}`;
    default:
      return "#";
  }
}
