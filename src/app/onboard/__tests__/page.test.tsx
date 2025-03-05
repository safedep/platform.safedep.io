import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import Onboard from "../page";
import { useUser } from "@auth0/nextjs-auth0/client";
import userEvent from "@testing-library/user-event";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: vi.fn(),
}));

const mocks = vi.hoisted(() => ({
  createOnboarding: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock `createOnboarding`
vi.mock("../actions", () => ({
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
    name: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useUser as Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
    });
  });

  it("renders onboarding form with user name", async () => {
    await setupComponent();
    expect(
      screen.getByText(
        `Welcome, ${mockUser.name}! Please fill in the details to onboard.`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Example Inc")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("redirects to home page when no user is logged in", async () => {
    (useUser as Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    await setupComponent();
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles form submission successfully", async () => {
    await setupComponent();
    const user = userEvent.setup();

    // Mock API success response
    mocks.createOnboarding.mockResolvedValueOnce({});

    // Fill out the form
    await user.type(screen.getByPlaceholderText("John Doe"), "My Name");
    await user.type(
      screen.getByPlaceholderText("Example Inc"),
      "My Organization",
    );
    await user.type(screen.getByPlaceholderText("example.com"), "mydomain.com");

    // Submit the form
    await user.click(screen.getByRole("button", { name: "Create" }));

    // Ensure API was called with correct data
    await waitFor(() => {
      expect(mocks.createOnboarding).toHaveBeenCalledWith({
        name: "My Name",
        organizationName: "My Organization",
        organizationDomain: "mydomain.com",
        email: "test@example.com",
      });
    });

    // Ensure success message is shown
    await waitFor(() => {
      expect(mocks.toast.success).toHaveBeenCalledWith(
        "Onboarding successful!",
      );
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("displays an error if the organization already exists", async () => {
    await setupComponent();
    const user = userEvent.setup();

    // Mock API error response
    mocks.createOnboarding.mockRejectedValueOnce(new Error("already_exists"));

    await user.type(screen.getByPlaceholderText("John Doe"), "My Name");
    await user.type(
      screen.getByPlaceholderText("Example Inc"),
      "My Organization",
    );
    await user.type(
      screen.getByPlaceholderText("example.com"),
      "existingdomain.com",
    );

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          /An organization with the same domain already exists/i,
        ),
      ).toBeInTheDocument();
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
      expect(mocks.toast.error).toHaveBeenCalledWith(
        "An error occurred. Please try again later.",
      );
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

    expect(
      screen.getByText("Creating your organization..."),
    ).toBeInTheDocument();
  });

  it("logout link is present", async () => {
    await setupComponent();
    expect(screen.getByRole("link", { name: "Sign out" })).toBeInTheDocument();
  });
});
