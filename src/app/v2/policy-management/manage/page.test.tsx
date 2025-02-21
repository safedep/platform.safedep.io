import { render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, vi, describe, it } from "vitest";
import Page from "./page";
import { act } from "react";

interface PolicyGroup {
  id: string;
  name?: string;
  updatedAt?: Date;
  createdAt?: Date;
  description?: string;
}

// Create a mock object with a mock function for getPolicyGroups
const mocks = vi.hoisted(() => ({
  getPolicyGroups: vi.fn(),

  // sonner library's toast object
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the sonner library to replace the toast object with our mock object
vi.mock("sonner", () => ({
  toast: mocks.toast,
}));

// Mock the ./actions module to replace getPolicyGroups with our mock function
vi.mock("./actions", () => ({
  getPolicyGroups: mocks.getPolicyGroups,
}));

// Utility to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe("Policy management page", () => {
  // Utility function to setup the component for testing
  async function setupComponent() {
    const queryClient = createTestQueryClient();
    const page = await Page();
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>,
      );
    });
  }

  it("can be mounted", async () => {
    mocks.getPolicyGroups.mockResolvedValue([]);
    await Page();
  });

  it("renders table headers correctly", async () => {
    mocks.getPolicyGroups.mockResolvedValue([]);
    await setupComponent();

    await waitFor(() => {
      const expectedColumns = [
        "Name",
        "Description",
        "Created At",
        "Last Updated",
      ];
      const headers = screen.getAllByRole("columnheader");

      // Check header count (including actions column)
      expect(headers).toHaveLength(expectedColumns.length + 1);

      // Check each header text
      expectedColumns.forEach((header) => {
        expect(
          screen.getByRole("columnheader", { name: header }),
        ).toBeInTheDocument();
      });
    });
  });

  it("renders table rows with correct content", async () => {
    const expectedPolicyGroups: PolicyGroup[] = [
      {
        id: "1",
        name: "Policy Group 1",
        description: "First policy group",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      },
      {
        id: "2",
        name: "Policy Group 2",
        description: "Second policy group",
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-04"),
      },
    ];
    mocks.getPolicyGroups.mockResolvedValue(expectedPolicyGroups);

    await setupComponent();

    await waitFor(() => {
      // Get all rows (excluding header row)
      const rows = screen.getAllByRole("row").slice(1);
      expect(rows).toHaveLength(expectedPolicyGroups.length);

      // Verify each row's content
      rows.forEach((row, index) => {
        const policyGroup = expectedPolicyGroups[index];
        expect(within(row).getByText(policyGroup.name!)).toBeInTheDocument();
        expect(
          within(row).getByText(policyGroup.description!),
        ).toBeInTheDocument();
      });
    });
  });

  it("renders error toast when policy groups fetch fails", async () => {
    mocks.getPolicyGroups.mockRejectedValue(
      new Error("Failed to fetch policy groups"),
    );
    await setupComponent();

    await waitFor(() => {
      expect(mocks.toast.error).toHaveBeenCalledOnce();
    });
  });

  it("renders page title and create button", async () => {
    mocks.getPolicyGroups.mockResolvedValue([]);
    await setupComponent();

    await waitFor(() => {
      // Check page title
      expect(screen.getByText("Policy Groups")).toBeInTheDocument();
      expect(
        screen.getByText("Manage your policy groups."),
      ).toBeInTheDocument();

      // Check create button
      const createButton = screen.getByRole("link", {
        name: /create policy group/i,
      });
      expect(createButton).toBeInTheDocument();
      expect(createButton.getAttribute("href")).toBe(
        "/v2/policy-management/new",
      );
    });
  });
});
