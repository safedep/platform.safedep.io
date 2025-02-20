import { render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, vi, describe, it } from "vitest";
import Page from "./page";
import { Policy } from "./actions";
import {
  PolicyTarget,
  PolicyType,
  PolicyVersion,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { act } from "react";

// Create a mock object with a mock function for getPolicies vi.hoisted ensures
// the mock is created before all tests
const mocks = vi.hoisted(() => ({
  getPolicies: vi.fn(),

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

// Mock the ./actions module to replace getPolicies with our mock function
vi.mock("./actions", () => ({
  getPolicies: mocks.getPolicies,
}));

// Utility to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

// The fields of a policy that are displayed in the table.
type PolicyField = keyof Pick<
  Policy,
  "version" | "target" | "type" | "name" | "rulesCount"
>;

// Maps policy values to their display text.
type DisplayMappings = {
  version: { [key in PolicyVersion]: string };
  target: { [key in PolicyTarget]: string };
  type: { [key in PolicyType]: string };
  rulesCount: (count: number) => string;
};

// Utility function to convert policy values to their display text.
function getDisplayValue(key: PolicyField, value: Policy[PolicyField]): string {
  const displayMappings: DisplayMappings = {
    version: {
      [PolicyVersion.V1]: "v1",
      [PolicyVersion.V2]: "v2",
      [PolicyVersion.UNSPECIFIED]: "Unknown",
    },
    target: {
      [PolicyTarget.VET]: "Vet",
      [PolicyTarget.UNSPECIFIED]: "Unknown",
    },
    type: {
      [PolicyType.ALLOW]: "Allow",
      [PolicyType.DENY]: "Deny",
      [PolicyType.UNSPECIFIED]: "Unknown",
    },
    rulesCount: (count: number) => `${count} rules`,
  };

  if (key in displayMappings) {
    const mapping = displayMappings[key as keyof DisplayMappings];

    // if the chosen mapping is a function, call it with the value
    if (typeof mapping === "function") {
      return mapping(value as number);
    }

    // otherwise, return the value from the mapping
    return mapping[value as keyof typeof mapping];
  }
  return value.toString();
}

describe("Policy list page", () => {
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
    mocks.getPolicies.mockResolvedValue([]);
    await Page();
  });

  it("renders table headers correctly", async () => {
    await setupComponent();

    await waitFor(() => {
      const expectedColumns = [
        "Name",
        "Version",
        "Target",
        "Type",
        "Labels",
        "Rules",
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
    const expectedPolicies = [
      {
        id: "1",
        name: "Policy 1",
        version: PolicyVersion.V1,
        type: PolicyType.DENY,
        labels: ["label1", "label2"],
        rulesCount: 1,
        target: PolicyTarget.VET,
      },
      {
        id: "2",
        name: "Policy 2",
        version: PolicyVersion.V2,
        type: PolicyType.ALLOW,
        labels: ["label3"],
        rulesCount: 3,
        target: PolicyTarget.VET,
      },
      {
        id: "3",
        name: "Policy 3",
        version: PolicyVersion.V2,
        type: PolicyType.ALLOW,
        labels: ["label3", "some-label"],
        rulesCount: 3,
        target: PolicyTarget.VET,
      },
    ] satisfies Policy[];
    mocks.getPolicies.mockResolvedValue(expectedPolicies);

    await setupComponent();

    await waitFor(() => {
      // Get all rows (excluding header row)
      const rows = screen.getAllByRole("row").slice(1);
      expect(rows).toHaveLength(expectedPolicies.length);

      // Verify each row's content
      for (const [index, row] of rows.entries()) {
        const policy = expectedPolicies[index];

        // Check basic fields
        for (const field of ["name", "version", "target", "type"] as const) {
          const displayValue = getDisplayValue(field, policy[field]);
          expect(within(row).getByText(displayValue)).toBeInTheDocument();
        }

        // Check labels
        for (const label of policy.labels) {
          expect(within(row).getByText(label)).toBeInTheDocument();
        }

        // Check rules count
        expect(
          within(row).getByText(
            getDisplayValue("rulesCount", policy.rulesCount),
          ),
        ).toBeInTheDocument();
      }
    });
  });

  it("renders error toast when policy fetch fails", async () => {
    mocks.getPolicies.mockRejectedValue(new Error("Failed to fetch policies"));
    await setupComponent();

    await waitFor(() => {
      expect(mocks.toast.error).toHaveBeenCalledOnce();
    });
  });
});
