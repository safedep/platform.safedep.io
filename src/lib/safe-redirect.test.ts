import { describe, expect, it } from "vitest";
import * as fc from "fast-check";
import { getSafeRedirect } from "./safe-redirect";

describe("safe-redirect", () => {
  const fallback = "/";

  it("rejects externals, protocol-relative, backslashes, and relatives", () => {
    const bads = fc.oneof(
      fc.oneof(
        fc.webUrl(),
        fc.webUrl().map((u) => `//${u}`),
      ), // //http(s)://... or http://...
      fc.domain().map((d) => `//${d}`), // protocol-relative
      fc.oneof(fc.ipV4(), fc.ipV6(), fc.ipV4Extended()).map((ip) => `//${ip}`),
    );

    fc.assert(
      fc.property(bads, (raw) => {
        const out = getSafeRedirect(raw, fallback);
        expect(out).toBe(fallback);
      }),
    );
  });

  it("rejects percent-encoded externals after one decode", () => {
    const encodedExternal = "https%3A%2F%2Fevil.example%2Fattack";
    const out = getSafeRedirect(encodedExternal, fallback);
    expect(out).toBe(fallback);
  });

  it("rejects paths that decode into protocol-relative", () => {
    const decodesToProtocolRelative = "/%2F%2Fevil";
    const out = getSafeRedirect(decodesToProtocolRelative, fallback);
    expect(out).toBe(fallback);
  });

  it("handles nullish by returning fallback", () => {
    expect(getSafeRedirect(null, fallback)).toBe(fallback);
    expect(getSafeRedirect(undefined, fallback)).toBe(fallback);
  });

  it("trims whitespace and still rejects externals", () => {
    const out = getSafeRedirect("   https://evil.com  ", fallback);
    expect(out).toBe(fallback);
  });
});
