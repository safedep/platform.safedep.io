import { render, screen, waitFor, within } from "@testing-library/react";
import { expect, vi, describe, it } from "vitest";
import Page from "./page";
import { act } from "react";

// Define the API key interface
interface ApiKey {
  keyId: string;
  name: string;
  description: string;
  expiresAt: Date;
}

// Create mock object for serverExecuteGetApiKeys
const mocks = vi.hoisted(() => ({
  serverExecuteGetApiKeys: vi.fn(),

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
  serverExecuteGetApiKeys: mocks.serverExecuteGetApiKeys,
}));

describe("API Keys Page", () => {
  // Utility function to setup the component for testing
  async function setupComponent() {
    const page = await Page();
    await act(async () => {
      render(page);
    });
  }

  it("renders table headers correctly", async () => {
    mocks.serverExecuteGetApiKeys.mockResolvedValue({
      tenant: "tenant-xyz",
      apiKeys: {
        keys: [],
      },
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
    const expectedApiKeys: ApiKey[] = [
      {
        keyId: "1",
        name: "API Key 1",
        description: "First API key",
        expiresAt: new Date("2024-01-01"),
      },
      {
        keyId: "2",
        name: "API Key 2",
        description: "Second API key",
        expiresAt: new Date("2024-02-01"),
      },
    ];

    mocks.serverExecuteGetApiKeys.mockResolvedValue({
      tenant: "tenant-xyz",
      apiKeys: {
        keys: expectedApiKeys,
      },
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

  it("displays Tenant Badge", async () => {
    mocks.serverExecuteGetApiKeys.mockResolvedValue({
      tenant: "tenant-xyz",
      apiKeys: {
        keys: [],
      },
    });

    await setupComponent();

    await waitFor(() => {
      expect(screen.getByText("tenant-xyz")).toBeInTheDocument();
    });
  });

  it("renders page title and create button", async () => {
    mocks.serverExecuteGetApiKeys.mockResolvedValue({
      tenant: "tenant-xyz",
      apiKeys: {
        keys: [],
      },
    });

    await setupComponent();

    await waitFor(() => {
      // Check create button
      const createButton = screen.getByRole("link", {
        name: /create api key/i,
      });
      expect(createButton).toBeInTheDocument();
      expect(createButton.getAttribute("href")).toBe(
        "/v2/settings/keys/create",
      );
    });
  });
});
