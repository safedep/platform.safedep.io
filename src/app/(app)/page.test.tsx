import { describe, it, expect, vi, beforeEach } from "vitest";
import Page from "./page";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { redirect } from "next/navigation";

// Create mock functions for testing
const mocks = vi.hoisted(() => ({
  getSessionOrRedirectTo: vi.fn(),
  getUserInfo: vi.fn(),
  sessionSetTenant: vi.fn(),
  mockRedirect: vi.fn(),
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

// Utility function to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

async function setupPageComponent() {
  const page = await Page();
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {page}
    </QueryClientProvider>
  );
}

describe("App Page", () => {
  // Set up before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows tenant selector when user has access", async () => {
    // arrange
    mocks.getUserInfo.mockResolvedValue({
      access: [
        {
          tenant: { domain: "tenant1" },
          canAdmin: true,
        },
        {
          tenant: { domain: "tenant2" },
          canAdmin: false,
        },
      ],
      name: "Test User",
      email: "test@example.com",
    });

    // act
    render(await setupPageComponent());

    // assert
    expect(screen.getByText("Select Tenant")).toBeInTheDocument();
  });

  it("redirects to /auth when session is not available", async () => {
    // arrange
    mocks.getSessionOrRedirectTo.mockImplementationOnce(async () => {
      redirect("/auth");
    });
    mocks.getUserInfo.mockResolvedValueOnce({
      access: [],
      name: "Test User",
      email: "test@example.com",
    });

    // act
    render(await setupPageComponent());

    // assert
    expect(mocks.mockRedirect).toHaveBeenCalledWith("/auth");
  });

  it("redirects to /onboard when user has no tenants", async () => {
    // arrange
    // Mock user with no access
    mocks.getUserInfo.mockResolvedValue({
      access: [],
      name: "Test User",
      email: "test@example.com",
    });

    // act
    render(await setupPageComponent());

    // assert
    expect(mocks.mockRedirect).toHaveBeenCalledWith("/onboard");
  });

  it("redirects to /keys after setting tenant", async () => {
    // arrange
    const serverAction = vi.fn().mockImplementation(async () => {
      await mocks.sessionSetTenant("tenant1");
      redirect("/keys");
    });

    // act
    await serverAction("tenant1");

    // assert
    expect(mocks.sessionSetTenant).toHaveBeenCalledWith("tenant1");
    expect(mocks.mockRedirect).toHaveBeenCalledWith("/keys");
  });

  // NOTE: it is not possible to test the redirect to /onboard when the user
  // info does not exist in the platform. This is because we cannot mock a
  // function referenced by another function. For example, if function A calls
  // function B, then even though we can mock function A, it is not possible to
  // mock function B in such a way that function A will call the mocked version
  // of B. In our case, we are trying to mock the `createUserServiceClient`
  // function (function B), which is called by `getUserInfo` server action
  // function (function A). For more information, see:
  // https://vitest.dev/guide/mocking.html#mocking-pitfalls
});
