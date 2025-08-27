import Page from "./page";
import { render } from "@testing-library/react";
import { connectTenantToGithub, getUserInfoOrRedirectToAuth } from "./actions";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mocks = vi.hoisted(() => ({
  actions: {
    connectTenantToGithub: vi.fn<typeof connectTenantToGithub>(),
    getUserInfoOrRedirectToAuth: vi.fn<typeof getUserInfoOrRedirectToAuth>(),
  },
  router: {
    push: vi.fn(),
  },
}));

vi.mock("./actions", () => ({
  connectTenantToGithub: mocks.actions.connectTenantToGithub,
  getUserInfoOrRedirectToAuth: mocks.actions.getUserInfoOrRedirectToAuth,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => mocks.router,
}));

async function setupPageComponent({
  searchParams,
}: {
  searchParams?: {
    code: string;
    installation_id: string;
    setup_action: string;
  };
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const {
    code = "test-code",
    installation_id = "12345",
    setup_action = "install",
  } = searchParams ?? {};

  const { container } = render(
    <QueryClientProvider client={queryClient}>
      {await Page({
        searchParams: Promise.resolve({
          code,
          installation_id,
          setup_action,
        }),
      })}
    </QueryClientProvider>,
  );

  return { page: container, queryClient };
}

describe("ConnectGithubPage", () => {
  it("should render", async () => {
    mocks.actions.getUserInfoOrRedirectToAuth.mockResolvedValue({
      email: "test@example.com",
      tenants: [],
    });
    const { page } = await setupPageComponent({});

    expect(page).toBeInTheDocument();
  });
});
