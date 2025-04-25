import { describe, expect, it, vi } from "vitest";
import { sessionRequireAuth } from "./session";

const mocks = vi.hoisted(() => ({
  auth0: {
    getSession: vi.fn(),
  },
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: mocks.auth0.getSession,
  },
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

describe("session tests", () => {
  it("should redirect to the auth page if the user is not authenticated", async () => {
    mocks.auth0.getSession.mockResolvedValue(undefined);
    await sessionRequireAuth();

    expect(mocks.redirect).toHaveBeenCalledWith("/auth");
  });
});
