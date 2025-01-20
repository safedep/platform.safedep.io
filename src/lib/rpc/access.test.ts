import { AccessLevel } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";
import {
  accessKeyToLevel,
  accessLevelToKey,
  accessLevelToLabel,
} from "./access";
import { describe, it, expect } from "vitest";

describe("Access", () => {
  it("should map from key to level", () => {
    expect(accessKeyToLevel("owner")).toBe(AccessLevel.OWNER);
    expect(accessKeyToLevel("admin")).toBe(AccessLevel.ADMIN);
    expect(accessKeyToLevel("member")).toBe(AccessLevel.MEMBER);
    expect(accessKeyToLevel("readonly")).toBe(AccessLevel.READ_ONLY);
    expect(accessKeyToLevel("noaccess")).toBe(AccessLevel.NO_ACCESS);
    expect(accessKeyToLevel("tooluser")).toBe(AccessLevel.TOOL_USER);
    expect(accessKeyToLevel("unspecified")).toBe(AccessLevel.UNSPECIFIED);
  });

  it("should map from level to key", () => {
    expect(accessLevelToKey(AccessLevel.OWNER)).toBe("owner");
    expect(accessLevelToKey(AccessLevel.ADMIN)).toBe("admin");
    expect(accessLevelToKey(AccessLevel.MEMBER)).toBe("member");
    expect(accessLevelToKey(AccessLevel.READ_ONLY)).toBe("readonly");
    expect(accessLevelToKey(AccessLevel.NO_ACCESS)).toBe("noaccess");
    expect(accessLevelToKey(AccessLevel.TOOL_USER)).toBe("tooluser");
    expect(accessLevelToKey(AccessLevel.UNSPECIFIED)).toBe("unspecified");
  });

  it("should throw an error for invalid key", () => {
    expect(() => accessKeyToLevel("invalid")).toThrowError(
      "Invalid access role",
    );
  });

  it("should throw an error for invalid level", () => {
    expect(() => accessLevelToKey(7 as unknown as AccessLevel)).toThrowError(
      "Invalid access level",
    );
  });

  it("should map from level to label", () => {
    expect(accessLevelToLabel(AccessLevel.OWNER)).toBe("Owner");
    expect(accessLevelToLabel(AccessLevel.ADMIN)).toBe("Admin");
    expect(accessLevelToLabel(AccessLevel.MEMBER)).toBe("Member");
    expect(accessLevelToLabel(AccessLevel.READ_ONLY)).toBe("Read-only");
    expect(accessLevelToLabel(AccessLevel.NO_ACCESS)).toBe("No access");
    expect(accessLevelToLabel(AccessLevel.TOOL_USER)).toBe("Tool user");
    expect(accessLevelToLabel(AccessLevel.UNSPECIFIED)).toBe("Unspecified");
  });
});
