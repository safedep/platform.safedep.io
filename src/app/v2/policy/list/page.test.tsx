import { render, screen, waitFor } from "@testing-library/react";
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

vi.mock("server-only", () => ({}));

vi.mock("./actions", () => ({
  getPolicies: vi.fn(
    () =>
      [
        {
          id: "1",
          name: "Policy 1",
          version: PolicyVersion.V1,
          type: PolicyType.DENY,
          labels: ["label1", "label2"],
          rulesCount: 1,
          target: PolicyTarget.VET,
        },
      ] satisfies Policy[],
  ),
}));

// Utility to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe("Policy list page", () => {
  it("can be mounted", async () => {
    await Page();
  });

  it("renders fetched data", async () => {
    const queryClient = createTestQueryClient();

    // since page is a server component, we need to "await" render it first
    const page = await Page();
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>,
      );
    });

    await waitFor(() =>
      expect(screen.getByText("Policy 1")).toBeInTheDocument(),
    );
  });
});
