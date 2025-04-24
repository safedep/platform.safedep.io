import { describe } from "node:test";
import Page from "./page";
import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  auth0: {
    getSession: vi.fn(),
  },
  navigation: {
    redirect: vi.fn(),
  },
}));

vi.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: mocks.auth0.getSession,
  },
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.navigation.redirect,
}));

async function setupPageComponent() {
  const page = await Page();
  return page;
}

describe("Verify Email Page", () => {
  it("should render the page", async () => {
    // Arrange
    mocks.auth0.getSession.mockResolvedValue({
      user: {
        email_verified: false,
      },
    });

    // Act
    render(await setupPageComponent());

    // Assert
    expect(mocks.navigation.redirect).not.toHaveBeenCalled();
    expect(screen.getByText("Verify your email")).toBeInTheDocument();
  });

  it("should redirect to the home page if the user is already verified", async () => {
    // Arrange
    mocks.auth0.getSession.mockResolvedValue({
      user: {
        email_verified: true,
      },
    });

    // Act
    render(await setupPageComponent());

    // Assert
    expect(mocks.navigation.redirect).toHaveBeenCalledWith("/");
  });
});
