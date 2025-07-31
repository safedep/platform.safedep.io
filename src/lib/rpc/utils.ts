import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import type { PackageVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_pb";

export function packageRegistryUrl(p?: PackageVersion): string {
  if (!p?.package) {
    return "#";
  }

  const name = p.package.name;
  switch (p.package.ecosystem) {
    case Ecosystem.UNSPECIFIED:
      return "#";
    case Ecosystem.MAVEN:
      return `https://search.maven.org/search?q=${name}`;
    case Ecosystem.NPM:
      return `https://www.npmjs.com/package/${name}`;
    case Ecosystem.PYPI:
      return `https://pypi.org/project/${name}`;
    case Ecosystem.RUBYGEMS:
      return `https://rubygems.org/gems/${name}`;
    case Ecosystem.NUGET:
      return `https://www.nuget.org/packages/${name}`;
    case Ecosystem.CARGO:
      return `https://crates.io/crates/${name}`;
    case Ecosystem.GO:
      return `https://pkg.go.dev/${name}`;
    case Ecosystem.GITHUB_ACTIONS:
      return `https://github.com/${name}`;
    case Ecosystem.PACKAGIST:
      return `https://packagist.org/packages/${name}`;
    case Ecosystem.TERRAFORM:
    case Ecosystem.TERRAFORM_MODULE:
      return `https://registry.terraform.io/modules/${name}`;
    case Ecosystem.TERRAFORM_PROVIDER:
      return `https://registry.terraform.io/providers/${name}`;
    case Ecosystem.VSCODE:
      return `https://marketplace.visualstudio.com/items?itemName=${name}`;
    case Ecosystem.GITHUB_REPOSITORY:
      return `https://github.com/${name}`;
    case Ecosystem.OPENVSX:
      return `https://open-vsx.org/extension/${name.replace(/\./g, "/")}`;
    default:
      const _exhaustiveCheck: never = p.package.ecosystem;
      void _exhaustiveCheck;
      return "#";
  }
}
