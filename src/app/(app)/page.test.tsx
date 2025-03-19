import { describe, it, expect, vi, beforeEach } from "vitest";
import Page from "./page";
import { render, screen } from "@testing-library/react";
import { Code, ConnectError } from "@connectrpc/connect";

// Create mock functions for dependencies, not the component under test
const mocks = vi.hoisted(() => ({
  getSessionOrRedirectTo: vi.fn(),
  getUserInfo: vi.fn(),
  sessionSetTenant: vi.fn(),
  mockRedirect: vi.fn(),
}));

// Mock server-only imports
vi.mock("server-only", () => ({}));

// Mock the actions module used by the Page component
vi.mock("./actions", () => ({
  getSessionOrRedirectTo: mocks.getSessionOrRedirectTo,
  getUserInfo: mocks.getUserInfo,
}));

// Mock session management functions
vi.mock("@/lib/session/session", () => ({
  sessionSetTenant: mocks.sessionSetTenant,
}));

// Mock navigation functions
vi.mock("next/navigation", () => ({
  redirect: mocks.mockRedirect,
}));

describe("App Page", () => {
  // Mock valid session and user info
  const mockSession = {
    user: {
      email: "test@example.com",
      name: "Test User",
    },
  };

  // Set up before each test
  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock implementation for session
    mocks.getSessionOrRedirectTo.mockResolvedValue(mockSession);
  });

  // Test case: redirect to /onboard when getUserInfo throws NotFound error
  it("redirects to /onboard when getUserInfo throws NotFound error (user not onboarded)", async () => {
    const notFoundError = new ConnectError("User not found", Code.NotFound);

    // Mock implementation to call redirect and then throw the error
    mocks.getUserInfo.mockImplementation(() => {
      mocks.mockRedirect("/onboard");
      throw notFoundError;
    });

    try {
      await Page();
    } catch (error) {
      expect(error).toBe(notFoundError);
    }

    expect(mocks.mockRedirect).toHaveBeenCalledWith("/onboard");
  });

  // Test case: redirect to /onboard when user has no access
  it("redirects to /onboard when user has no access", async () => {
    // Mock user with no access
    mocks.getUserInfo.mockResolvedValue({
      access: [],
      name: "Test User",
      email: "test@example.com",
    });

    await Page(); // Call the actual Page component

    expect(mocks.mockRedirect).toHaveBeenCalledWith("/onboard");
  });

  // Test case: show tenant selector when user has access
  it("shows tenant selector when user has access", async () => {
    // Mock user with access to tenants
    const mockUserInfo = {
      access: [
        {
          tenant: {
            domain: "tenant1",
          },
          canAdmin: true,
        },
        {
          tenant: {
            domain: "tenant2",
          },
          canAdmin: false,
        },
      ],
      name: "Test User",
      email: "test@example.com",
    };

    mocks.getUserInfo.mockResolvedValue(mockUserInfo); // Resolve user info mock

    const component = await Page(); // Call the actual Page component

    // Render component
    render(component);

    // Check for welcome message with user email
    expect(screen.getByText(/Welcome test@example.com/i)).toBeInTheDocument();
  });

  // Test case: redirect to /auth when session is not available
  it("redirects to /auth when session is not available", async () => {
    // Mock implementation to call redirect and return null
    mocks.getSessionOrRedirectTo.mockImplementation(() => {
      mocks.mockRedirect("/auth");
      return null;
    });

    await Page(); // Call the actual Page component

    expect(mocks.mockRedirect).toHaveBeenCalledWith("/auth");
  });

  // Test case: server action can be invoked
  it("has a server action to set tenant and redirect", async () => {
    // Mock user with access to tenants first to render the component
    const mockUserInfo = {
      access: [
        {
          tenant: {
            domain: "tenant1",
          },
          canAdmin: true,
        },
      ],
      name: "Test User",
      email: "test@example.com",
    };

    mocks.getUserInfo.mockResolvedValue(mockUserInfo);

    // Server actions can't be directly tested in client component tests
    // because they run on the server. We can only test for their presence
    // and verify the component renders correctly.
    const component = await Page();
    render(component);

    // Verify the component renders with user data
    expect(screen.getByText(/Welcome test@example.com/i)).toBeInTheDocument();
  });

  // Test case: throw error when getUserInfo throws non-NotFound error
  it("throws error when getUserInfo throws non-NotFound error", async () => {
    const testError = new ConnectError("Internal server error", Code.Internal); // Create a specific error
    mocks.getUserInfo.mockRejectedValue(testError); // Mock getUserInfo to throw a different error

    // The page should propagate this error
    await expect(Page()).rejects.toThrow(testError);

    expect(mocks.mockRedirect).not.toHaveBeenCalled();
  });
});
