import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, vi, describe, it } from "vitest";
import Page from "./page";
import { act } from "react";
import userEvent from "@testing-library/user-event";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Create mock objects
const mocks = vi.hoisted(() => ({
  createPolicyGroup: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the sonner library
vi.mock("sonner", () => ({
  toast: mocks.toast,
}));

// Mock the actions module
vi.mock("./actions", () => ({
  createPolicyGroup: mocks.createPolicyGroup,
}));

// Utility to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe("Create Policy Group page", () => {
  // Setup function for the component
  async function setupComponent() {
    const queryClient = createTestQueryClient();
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <Page />
        </QueryClientProvider>,
      );
    });
  }

  it("renders the create policy group form", async () => {
    await setupComponent();

    // Check page title and form elements
    expect(screen.getByText("Create New Policy Group")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("submits form with valid data successfully", async () => {
    const user = userEvent.setup();
    await setupComponent();

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), "Test Policy Group");
    await user.type(screen.getByLabelText(/description/i), "Test Description");

    // Submit the form
    mocks.createPolicyGroup.mockResolvedValueOnce(undefined);
    await user.click(screen.getByRole("button", { name: /create/i }));

    // Check if mutation was called with correct data
    await waitFor(() => {
      expect(mocks.createPolicyGroup).toHaveBeenCalledWith({
        name: "Test Policy Group",
        description: "Test Description",
      });
    });

    // Check success flow
    await waitFor(() => {
      expect(mocks.toast.success).toHaveBeenCalledWith("Policy group created");
      expect(mockPush).toHaveBeenCalledWith("/v2/policy-management/manage");
    });
  });

  it("shows validation errors for empty name", async () => {
    const user = userEvent.setup();
    await setupComponent();

    // Try to submit without filling name
    await user.click(screen.getByRole("button", { name: /create/i }));

    // Check for validation error
    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 1 character"),
      ).toBeInTheDocument();
    });
  });

  it("handles API errors correctly", async () => {
    // Mock API error
    mocks.createPolicyGroup.mockRejectedValue(new Error("API Error"));

    const user = userEvent.setup();
    await setupComponent();

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), "Test Policy Group");
    // Submit the form
    await user.click(screen.getByRole("button", { name: /create/i }));

    // Check error handling
    await waitFor(() => {
      expect(mocks.toast.error).toHaveBeenCalledOnce();
    });
  });

  it("submits form without description", async () => {
    const user = userEvent.setup();
    await setupComponent();

    // Fill out only the required name field
    await user.type(screen.getByLabelText(/name/i), "Test Policy Group");

    // Submit the form
    mocks.createPolicyGroup.mockResolvedValueOnce(undefined);
    await user.click(screen.getByRole("button", { name: /create/i }));

    // Check if mutation was called with correct data
    await waitFor(() => {
      expect(mocks.createPolicyGroup).toHaveBeenCalledWith({
        name: "Test Policy Group",
        description: "",
      });
    });

    // Check success flow
    await waitFor(() => {
      expect(mocks.toast.success).toHaveBeenCalledWith("Policy group created");
      expect(mockPush).toHaveBeenCalledWith("/v2/policy-management/manage");
    });
  });
});
