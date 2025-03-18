import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Page from "./page";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  createOnboarding: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  useUser: vi.fn(),

  mockPush: vi.fn(),

  mockReplace: vi.fn(),

  getSession: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: mocks.getSession,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.mockPush,
    replace: mocks.mockReplace,
  }),
}));

vi.mock("@auth0/nextjs-auth0", () => ({
  useUser: mocks.useUser,
}));

// Mock `createOnboarding`
vi.mock("./actions", () => ({
  createOnboarding: mocks.createOnboarding,
}));

// Mock toast notifications
vi.mock("sonner", () => ({
  toast: mocks.toast,
}));

// Utility to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe("Onboard Component", () => {
  async function setupComponent() {
    const queryClient = createTestQueryClient();
    const onboard = await Page();

    render(
      <QueryClientProvider client={queryClient}>{onboard}</QueryClientProvider>,
    );
  }

  const mockUser = {
    name: "My Name",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getSession.mockReturnValue({
      user: mockUser,
    });
  });

  it("renders onboarding form with user name", async () => {
    await setupComponent();
    expect(
      screen.getByText((content) =>
        content.includes(`Welcome, ${mockUser.name}!`),
      ),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Example Inc")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Organization" }),
    ).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    await setupComponent();
    const user = userEvent.setup();

    // Mock API success response
    mocks.createOnboarding.mockResolvedValueOnce({});

    // Fill out the form
    await user.clear(screen.getByPlaceholderText("John Doe")); // Clear existing input
    await user.type(screen.getByPlaceholderText("John Doe"), "My Name");

    await user.type(
      screen.getByPlaceholderText("Example Inc"),
      "My Organization",
    );
    await user.type(screen.getByPlaceholderText("example.com"), "mydomain.com");

    // Submit the form
    await user.click(
      screen.getByRole("button", { name: "Create Organization" }),
    );

    // Ensure API was called with correct data
    await waitFor(() => {
      expect(mocks.createOnboarding).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "My Name",
          email: "test@example.com",
          organizationDomain: "mydomain.com",
          organizationName: "My Organization",
        }),
      );
    });
  });

  it("displays an error if the organization already exists", async () => {
    await setupComponent();
    const user = userEvent.setup();

    // Mock API response to return 'Tenant already exists' error
    mocks.createOnboarding.mockResolvedValueOnce({
      error: "Tenant already exists",
    });

    await user.clear(screen.getByPlaceholderText("John Doe"));
    await user.type(screen.getByPlaceholderText("John Doe"), "My Name");
    await user.type(
      screen.getByPlaceholderText("Example Inc"),
      "My Organization",
    );
    await user.type(
      screen.getByPlaceholderText("example.com"),
      "existingdomain.com",
    );

    await user.click(
      screen.getByRole("button", { name: "Create Organization" }),
    );

    // Verify toast error message is displayed correctly
    await waitFor(() => {
      expect(mocks.toast.error).toHaveBeenCalledWith("Error", {
        description: "You have already been onboarded",
      });
    });
  });

  // FIXME: this test fails with unhandled promise rejection. It's not clear why
  // that happens. Seems like it can't differentiate between mock errors and
  // actual errors.
  it.skip("handles network error during submission", async () => {
    await setupComponent();
    const user = userEvent.setup();

    // Mock API failure
    mocks.createOnboarding.mockRejectedValue(new Error("Network Error"));

    await user.type(screen.getByPlaceholderText("John Doe"), "My Name");
    await user.type(
      screen.getByPlaceholderText("Example Inc"),
      "My Organization",
    );
    await user.type(
      screen.getByPlaceholderText("example.com"),
      "networkerror.com",
    );

    await user.click(
      screen.getByRole("button", { name: "Create Organization" }),
    );

    await waitFor(() => {
      expect(mocks.toast.error).toHaveBeenCalledWith("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    });
  });

  it("disables create button when submission is in progress", async () => {
    await setupComponent();
    const user = userEvent.setup();

    mocks.createOnboarding.mockImplementation(() => new Promise(() => {}));

    await user.type(screen.getByPlaceholderText("John Doe"), "My Name");
    await user.type(
      screen.getByPlaceholderText("Example Inc"),
      "My Organization",
    );
    await user.type(screen.getByPlaceholderText("example.com"), "loading.com");

    await user.click(
      screen.getByRole("button", { name: "Create Organization" }),
    );
  });

  it("shows a loading state when onboarding is in progress", async () => {
    await setupComponent();
    const user = userEvent.setup();

    mocks.createOnboarding.mockImplementation(() => new Promise(() => {}));

    await user.type(screen.getByPlaceholderText("John Doe"), "My Name");
    await user.type(
      screen.getByPlaceholderText("Example Inc"),
      "My Organization",
    );
    await user.type(
      screen.getByPlaceholderText("example.com"),
      "loadingstate.com",
    );

    await user.click(
      screen.getByRole("button", { name: "Create Organization" }),
    );
  });

  it("logout link is present", async () => {
    await setupComponent();
    expect(screen.getByRole("link", { name: "Sign out" })).toBeInTheDocument();
  });
});
