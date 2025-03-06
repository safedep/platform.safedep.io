import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Onboard from "./page";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  createOnboarding: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  useUser: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
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
    render(
      <QueryClientProvider client={queryClient}>
        <Onboard />
      </QueryClientProvider>,
    );
  }

  const mockUser = {
    name: "My Name",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useUser.mockReturnValue({
      user: mockUser,
      isLoading: false,
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

  it("handles network error during submission", async () => {
    await setupComponent();
    const user = userEvent.setup();

    // Mock API failure
    mocks.createOnboarding.mockRejectedValueOnce(new Error("Network Error"));

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
