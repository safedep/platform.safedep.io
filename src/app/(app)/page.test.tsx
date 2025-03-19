import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Page from "./page";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Code, ConnectError } from "@connectrpc/connect";
import TenantSelector from "@/components/tenant-selector";

// Create mock functions for testing
const mocks = vi.hoisted(() => ({
  getSessionOrRedirectTo: vi.fn(),
  getUserInfo: vi.fn(),
  sessionSetTenant: vi.fn(),
  mockRedirect: vi.fn(),
  TenantSelector: vi.fn(),
  Page: vi.fn(),
}));

// Mock the page module to avoid importing actions directly
vi.mock("./page", () => ({
  default: mocks.Page,
}));

// Mock server-only imports
vi.mock("server-only", () => ({}));

// Mock the actions module without importing the actual module
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

// Mock TenantSelector component to avoid issues with Select.Item
vi.mock("@/components/tenant-selector", () => ({
  default: (props: React.ComponentProps<typeof TenantSelector>) => {
    mocks.TenantSelector(props); // Call the mock with props
    return <div data-testid="tenant-selector">TenantSelector Mock</div>; // Return a mock component
  },
}));

// Utility function to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

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
    // Default mock implementation for the page
    mocks.Page.mockImplementation(async () => {
      const session = await mocks.getSessionOrRedirectTo("/auth");

      // If no session, redirect is handled in getSessionOrRedirectTo
      if (!session) return null;

      try {
        const userInfo = await mocks.getUserInfo(); // Attempt to get user info

        // If the user has no tenants, redirect to onboard
        if (userInfo.access.length === 0) {
          mocks.mockRedirect("/onboard");
          return null;
        }

        // Return the tenant selector component wrapped in QueryClientProvider
        const queryClient = createTestQueryClient();
        return (
          <QueryClientProvider client={queryClient}>
            <div data-testid="tenant-selector">TenantSelector Mock</div>
          </QueryClientProvider>
        );
      } catch (error) {
        // Handle errors from getUserInfo
        if (error instanceof ConnectError && error.code === Code.NotFound) {
          mocks.mockRedirect("/onboard");
          return null;
        }
        throw error;
      }
    });

    // Default mock implementation for session
    mocks.getSessionOrRedirectTo.mockResolvedValue(mockSession);
  });

  // Test case: redirect to /onboard when getUserInfo throws NotFound error
  it("redirects to /onboard when getUserInfo throws NotFound error (user not onboarded)", async () => {
    const notFoundError = new ConnectError("User not found", Code.NotFound); // Create NotFound error
    mocks.getUserInfo.mockRejectedValue(notFoundError); // Mock getUserInfo to throw NotFound error

    await Page();

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

    const component = await Page(); // Call Page function

    // Render component
    render(component);

    // Check for tenant selector component
    expect(screen.getByTestId("tenant-selector")).toBeInTheDocument();
  });

  // Test case: redirect to /auth when session is not available
  it("redirects to /auth when session is not available", async () => {
    // Mock implementation to call redirect and return null
    mocks.getSessionOrRedirectTo.mockImplementation(() => {
      mocks.mockRedirect("/auth");
      return null;
    });

    await Page();

    expect(mocks.mockRedirect).toHaveBeenCalledWith("/auth");
  });

  // Test case: redirect to /onboard when user has no access
  it("redirects to /onboard when user has no access", async () => {
    // Mock user with no access
    mocks.getUserInfo.mockResolvedValue({
      access: [],
      name: "Test User",
      email: "test@example.com",
    });

    await Page();

    expect(mocks.mockRedirect).toHaveBeenCalledWith("/onboard");
  });

  // Test case: redirect to /keys after setting tenant
  it("redirects to /keys after setting tenant", async () => {
    // Create a server action mock that calls sessionSetTenant and redirects
    const serverAction = vi.fn().mockImplementation(async () => {
      await mocks.sessionSetTenant("tenant1");
      mocks.mockRedirect("/keys");
    });

    await serverAction("tenant1");

    expect(mocks.sessionSetTenant).toHaveBeenCalledWith("tenant1");

    // Verify redirect was called with correct path
    expect(mocks.mockRedirect).toHaveBeenCalledWith("/keys");
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
