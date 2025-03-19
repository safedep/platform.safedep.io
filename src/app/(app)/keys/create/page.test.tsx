import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import Page from "./page";
import userEvent from "@testing-library/user-event";

// Mock `next/navigation`
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Hoist mock variables before using them
const mocks = vi.hoisted(() => ({
  createApiKey: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock `createApiKey`
vi.mock("./actions", () => ({
  createApiKey: mocks.createApiKey,
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

describe("API Key Creation Page", () => {
  async function setupComponent() {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );
  }

  it("submits the form and displays API key and tenant", async () => {
    await setupComponent();
    const user = userEvent.setup();

    // Mock API response
    mocks.createApiKey.mockResolvedValueOnce({
      key: "test-api-key-123",
      tenant: "tenant-xyz",
    });

    // Fill out the form
    await user.type(screen.getByLabelText(/Name/i), "My API Key");
    await user.type(screen.getByLabelText(/Description/i), "Test API Key");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Create/i }));

    // Ensure API was called with correct data
    await waitFor(() => {
      expect(mocks.createApiKey).toHaveBeenCalledWith({
        name: "My API Key",
        description: "Test API Key",
        expiryDays: 30, // Default expiry
      });
    });

    // Ensure UI updates with the API response
    await waitFor(() => {
      expect(screen.getByText("API Key Created")).toBeInTheDocument();
      expect(screen.getByText("tenant-xyz")).toBeInTheDocument();
      expect(screen.getByText("test-api-key-123")).toBeInTheDocument();
    });
  });
});
