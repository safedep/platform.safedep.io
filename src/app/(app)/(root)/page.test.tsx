import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./page";
import { render, screen, waitFor, within } from "@testing-library/react";
import { User } from "@auth0/nextjs-auth0/types";
import { GetUserInfoResponseSchema } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/user_pb";
import { create } from "@bufbuild/protobuf";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  sessionRequireAuth: vi.fn(),
  sessionSetTenant: vi.fn(),
  getUserInfo: vi.fn(),
  redirect: vi.fn(),

  auth0: {
    getSession: vi.fn(),
  },
}));

vi.mock("@/lib/session/session", () => ({
  sessionRequireAuth: mocks.sessionRequireAuth,
  sessionSetTenant: mocks.sessionSetTenant,
}));

vi.mock("./actions", () => ({
  getUserInfo: mocks.getUserInfo,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: mocks.auth0.getSession,
  },
}));

// shadcn combobox uses hasPointerCapture internally which is not supported in
// simulated environments
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

async function setupPageComponent() {
  return await Page();
}

describe("Tenant Selector Page", () => {
  beforeEach(() => {
    mocks.sessionRequireAuth.mockResolvedValue({
      user: {
        email: "test@test.com",
        sub: "123",
      } satisfies User,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render the page", async () => {
    mocks.getUserInfo.mockResolvedValue(
      create(GetUserInfoResponseSchema, {
        access: [
          {
            tenant: { domain: "foobar" },
          },
        ],
      }),
    );

    // Act
    render(await setupPageComponent());

    // Assert
    expect(screen.getByText("Welcome test@test.com")).toBeInTheDocument();
  });

  it("should redirect to the onboarding page if the user has no tenant", async () => {
    // Arrange
    mocks.getUserInfo.mockResolvedValue(
      create(GetUserInfoResponseSchema, {
        access: [],
      }),
    );

    // Act
    render(await setupPageComponent());

    // Assert
    expect(mocks.sessionSetTenant).not.toHaveBeenCalled();
    expect(mocks.redirect).toHaveBeenCalledWith("/onboard");
  });

  it("select on a tenant and redirect to keys", async () => {
    // Arrange
    mocks.getUserInfo.mockResolvedValue(
      create(GetUserInfoResponseSchema, {
        access: [{ tenant: { domain: "foobar" } }],
      }),
    );
    const user = userEvent.setup();

    // Act
    render(await setupPageComponent());

    await waitFor(async () => {
      // Assert
      const select = await screen.findByRole("combobox");
      const text = within(select).getByText("Select a tenant");
      expect(text).toBeInTheDocument();
      await user.click(select);

      const option = await screen.findByText("foobar");
      await user.click(option);

      expect(mocks.sessionSetTenant).toHaveBeenCalledWith("foobar");
      expect(mocks.redirect).toHaveBeenCalledWith("/keys");
    });
  });
});
