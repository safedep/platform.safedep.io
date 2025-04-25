import { afterEach, describe, expect, it, vi } from "vitest";
import Page from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { ApiKeys, getUserInfo } from "./actions";

type UserInfo = Awaited<ReturnType<typeof getUserInfo>>;

const mocks = vi.hoisted(() => ({
  actions: {
    deleteApiKey: vi.fn(),
    getApiKeys: vi.fn(),
    getUserInfo: vi.fn(),
    switchTenant: vi.fn(),
  },
  session: {
    sessionGetTenant: vi.fn(),
    sessionRequireAuth: vi.fn(),
  },
  navigation: {
    redirect: vi.fn(),
  },
}));

vi.mock("./actions", () => ({
  deleteApiKey: mocks.actions.deleteApiKey,
  getApiKeys: mocks.actions.getApiKeys,
  getUserInfo: mocks.actions.getUserInfo,
  switchTenant: mocks.actions.switchTenant,
}));

vi.mock("@/lib/session/session", () => ({
  sessionGetTenant: mocks.session.sessionGetTenant,
  sessionRequireAuth: mocks.session.sessionRequireAuth,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.navigation.redirect,
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

async function setupPageComponent() {
  const queryClient = createQueryClient();
  const page = await Page();
  return {
    page: (
      <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>
    ),
    queryClient,
  };
}

describe("Keys Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render the page", async () => {
    // Arrange
    // set response for api keys listing action
    mocks.actions.getApiKeys.mockResolvedValue({
      tenant: "some-tenant",
      apiKeys: [],
    } satisfies ApiKeys);

    // set response for user info action
    mocks.actions.getUserInfo.mockResolvedValue({
      userInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://example.com/avatar.png",
      },
      tenants: [],
      currentTenant: "some-tenant",
    } satisfies UserInfo);
    mocks.session.sessionGetTenant.mockResolvedValue("some-tenant");

    // Act
    const { page } = await setupPageComponent();
    render(page);

    // Assert
    expect(mocks.navigation.redirect).not.toHaveBeenCalled();
  });

  it("should redirect to tenant selector page if no tenant is selected", async () => {
    // Arrange
    mocks.session.sessionGetTenant.mockResolvedValue(null);

    // Act
    const { page } = await setupPageComponent();
    render(page);

    // Assert
    expect(mocks.navigation.redirect).toHaveBeenCalledWith("/");
  });

  it("should display user info", async () => {
    // Arrange
    // set response for api keys listing action
    mocks.actions.getApiKeys.mockResolvedValue({
      tenant: "some-tenant",
      apiKeys: [],
    } satisfies ApiKeys);

    // set response for user info action
    mocks.actions.getUserInfo.mockResolvedValue({
      userInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://example.com/avatar.png",
      },
      tenants: [],
      currentTenant: "some-tenant",
    } satisfies UserInfo);
    // this tells us what tenant is currently selected (set as cookie in the
    // browser)
    mocks.session.sessionGetTenant.mockResolvedValue("some-tenant");

    // Act
    const { page, queryClient } = await setupPageComponent();
    render(page);
    await waitFor(() => {
      // wait for the query client to resolve all queries
      expect(queryClient.isFetching()).toBe(0);
    });

    // Assert
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });
});
