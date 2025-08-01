import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import {
  PackageVersion,
  PackageVersionSchema,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_pb";
import { describe, it, expect } from "vitest";
import { packageRegistryUrl } from "./utils";
import { create } from "@bufbuild/protobuf";

describe("packageRegistryUrl", () => {
  it("returns the correct URL for NPM packages", () => {
    const p = {
      package: { ecosystem: Ecosystem.NPM, name: "foo" },
    } as PackageVersion;
    expect(packageRegistryUrl(p)).toBe("https://www.npmjs.com/package/foo");
  });

  it("returns correct URL for namespaced npm package", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.NPM, name: "@foo/bar" },
    });
    expect(packageRegistryUrl(p)).toBe(
      "https://www.npmjs.com/package/@foo/bar",
    );
  });

  it("returns # for undefined package", () => {
    expect(packageRegistryUrl(undefined)).toBe("#");
  });

  it("returns the correct URL for MAVEN packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.MAVEN, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("https://search.maven.org/search?q=foo");
  });

  it("returns the correct URL for PYPI packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.PYPI, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("https://pypi.org/project/foo");
  });

  it("returns the correct URL for RUBYGEMS packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.RUBYGEMS, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("https://rubygems.org/gems/foo");
  });

  it("returns the correct URL for NUGET packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.NUGET, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("https://www.nuget.org/packages/foo");
  });

  it("returns the correct URL for CARGO packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.CARGO, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("https://crates.io/crates/foo");
  });

  it("returns the correct URL for GO packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.GO, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("https://pkg.go.dev/foo");
  });

  it("returns the correct URL for GITHUB_ACTIONS packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.GITHUB_ACTIONS, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("https://github.com/foo");
  });

  it("returns the correct URL for PACKAGIST packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.PACKAGIST, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("https://packagist.org/packages/foo");
  });

  it("returns the correct URL for TERRAFORM and TERRAFORM_MODULE packages", () => {
    const pTerraform = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.TERRAFORM, name: "foo" },
    });
    const pModule = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.TERRAFORM_MODULE, name: "foo" },
    });
    expect(packageRegistryUrl(pTerraform)).toBe(
      "https://registry.terraform.io/modules/foo",
    );
    expect(packageRegistryUrl(pModule)).toBe(
      "https://registry.terraform.io/modules/foo",
    );
  });

  it("returns the correct URL for TERRAFORM_PROVIDER packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.TERRAFORM_PROVIDER, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe(
      "https://registry.terraform.io/providers/foo",
    );
  });

  it("returns the correct URL for VSCODE packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.VSCODE, name: "foo.bar" },
    });
    expect(packageRegistryUrl(p)).toBe(
      "https://marketplace.visualstudio.com/items?itemName=foo.bar",
    );
  });

  it("returns the correct URL for GITHUB_REPOSITORY packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.GITHUB_REPOSITORY, name: "foo/bar" },
    });
    expect(packageRegistryUrl(p)).toBe("https://github.com/foo/bar");
  });

  it("returns the correct URL for OPENVSX packages", () => {
    const p = create(PackageVersionSchema, {
      package: { ecosystem: Ecosystem.OPENVSX, name: "foo.bar" },
    });
    expect(packageRegistryUrl(p)).toBe(
      "https://open-vsx.org/extension/foo/bar",
    );
  });

  it("returns '#' for unhandled ecosystems", () => {
    // Using an ecosystem value that is not handled. Casting -1 to Ecosystem.
    const p = create(PackageVersionSchema, {
      package: { ecosystem: -1 as Ecosystem, name: "foo" },
    });
    expect(packageRegistryUrl(p)).toBe("#");
  });
});
