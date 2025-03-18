import { render, screen, waitFor, within } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";
import Page from "./page";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Define the API key interface
interface ApiKey {
  keyId: string;
  name: string;
  description: string;
  expiresAt: Date;
}

// Create mock object for serverExecuteGetApiKeys
const mocks = vi.hoisted(() => ({
  getApiKeys: vi.fn(),
  useUser: vi.fn(),
  // Mock toast from sonner
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: mocks.toast,
}));

// Mock the actions module
vi.mock("./actions", () => ({
  getApiKeys: mocks.getApiKeys,
}));

// Mock useUser hook
vi.mock("@/lib/hooks/use-user", () => ({
  useUser: () => ({
    user: {
      name: "Test User",
      email: "test@example.com",
    },
  }),
}));

describe("API Keys Page", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    mocks.getApiKeys.mockClear();
  });

  // Utility function to setup the component for testing
  async function setupComponent() {
    const page = await Page();
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>,
      );
    });
  }

  it("renders table headers correctly", async () => {
    mocks.getApiKeys.mockResolvedValue({
      tenant: "tenant-xyz",
      apiKeys: [],
    });

    await setupComponent();

    await waitFor(() => {
      const expectedColumns = ["Name", "Description", "Expires At"];
      const headers = screen.getAllByRole("columnheader");

      // Check header count (including actions column)
      expect(headers).toHaveLength(expectedColumns.length + 2);

      // Check each header text
      expectedColumns.forEach((header) => {
        expect(
          screen.getByRole("columnheader", { name: header }),
        ).toBeInTheDocument();
      });
    });
  });

  it("renders table rows with correct content", async () => {
    const expectedApiKeys = [
      {
        id: "1",
        name: "API Key 1",
        description: "First API key",
        expiresAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        name: "API Key 2",
        description: "Second API key",
        expiresAt: new Date("2024-02-01"),
      },
    ];

    mocks.getApiKeys.mockResolvedValue({
      tenant: "tenant-xyz",
      apiKeys: expectedApiKeys,
    });

    await setupComponent();

    await waitFor(() => {
      // Get all rows (excluding the header row)
      const rows = screen.getAllByRole("row").slice(1);
      expect(rows).toHaveLength(expectedApiKeys.length);

      // Verify each row's content
      rows.forEach((row, index) => {
        const apiKey = expectedApiKeys[index];
        expect(within(row).getByText(apiKey.name)).toBeInTheDocument();
        expect(within(row).getByText(apiKey.description)).toBeInTheDocument();
      });
    });
  });

  it("renders page title and create button", async () => {
    mocks.getApiKeys.mockResolvedValue({
      tenant: "tenant-xyz",
      apiKeys: [],
    });

    await setupComponent();

    await waitFor(() => {
      // Check create button
      const createButton = screen.getByRole("link", {
        name: /create api key/i,
      });
      expect(createButton).toBeInTheDocument();
      expect(createButton.getAttribute("href")).toBe("/keys/create");
    });
  });
});
