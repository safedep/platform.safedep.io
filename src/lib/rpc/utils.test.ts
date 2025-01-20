import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { Package } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_pb";
import { PackageVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_pb";
import { describe, it, expect } from "vitest";
import { packageRegistryUrl } from "./utils";

describe("packageRegistryUrl", () => {
  it("returns the correct URL for NPM packages", () => {
    const p = new PackageVersion();
    p.package = new Package();
    p.package.ecosystem = Ecosystem.NPM;
    p.package.name = "foo";
    expect(packageRegistryUrl(p)).toBe("https://www.npmjs.com/package/foo");
  });

  it("returns correct URL for namespaced npm package", () => {
    const p = new PackageVersion();
    p.package = new Package();
    p.package.ecosystem = Ecosystem.NPM;
    p.package.name = "@foo/bar";
    expect(packageRegistryUrl(p)).toBe(
      "https://www.npmjs.com/package/@foo/bar",
    );
  });

  it("returns # for null package", () => {
    expect(packageRegistryUrl(null)).toBe("#");
  });

  it("returns # for unknown ecosystems", () => {
    const p = new PackageVersion();
    p.package = new Package();
    p.package.ecosystem = Ecosystem.UNSPECIFIED;
    p.package.name = "foo";

    expect(packageRegistryUrl(p)).toBe("#");
  });
});
