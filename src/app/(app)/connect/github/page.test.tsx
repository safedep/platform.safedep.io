import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Page from "./page";
import { connectTenantToGithub, getUserInfoOrRedirectToAuth } from "./actions";
import {
  Access,
  AccessSchema,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";
import { create } from "@bufbuild/protobuf";
import userEvent from "@testing-library/user-event";

type UserInfoResult = Awaited<ReturnType<typeof getUserInfoOrRedirectToAuth>>;

const mocks = vi.hoisted(() => ({
  actions: {
    connectTenantToGithub: vi.fn<typeof connectTenantToGithub>(),
    getUserInfoOrRedirectToAuth: vi.fn<typeof getUserInfoOrRedirectToAuth>(),
  },
  navigation: {
    redirect: vi.fn(),
    useRouter: {
      push: vi.fn(),
      replace: vi.fn(),
    },
  },
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("./actions", () => ({
  connectTenantToGithub: mocks.actions.connectTenantToGithub,
  getUserInfoOrRedirectToAuth: mocks.actions.getUserInfoOrRedirectToAuth,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.navigation.redirect,
  useRouter: () => mocks.navigation.useRouter,
}));

vi.mock("sonner", () => ({
  toast: mocks.toast,
}));

// shadcn Select uses hasPointerCapture internally which is not supported in jsdom
// provide a minimal stub to avoid errors during interaction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window.HTMLElement.prototype as any).hasPointerCapture = vi.fn();

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function createMockAccess(domain: string): Access {
  return create(AccessSchema, {
    tenant: { domain },
  });
}

async function setupPageComponent({
  searchParams,
}: {
  searchParams?: {
    code?: string;
    installation_id?: string;
    setup_action?: string;
  };
}) {
  const queryClient = createQueryClient();

  const page = await Page({
    // @ts-expect-error - we want to test the page with undefined values
    searchParams: Promise.resolve({ ...searchParams }),
  });
  const { container } = render(
    <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>,
  );

  return {
    page: container,
    queryClient,
  };
}

describe("ConnectGithubPage", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it("should render with valid search params", async () => {
    // Arrange
    mocks.actions.getUserInfoOrRedirectToAuth.mockResolvedValue({
      email: "test@example.com",
      tenants: [createMockAccess("test.com")],
    } satisfies UserInfoResult);

    // Act
    await setupPageComponent({
      searchParams: {
        code: "github-code-123",
        installation_id: "12345",
        setup_action: "install",
      },
    });

    // Assert
    expect(mocks.navigation.redirect).not.toHaveBeenCalled();
    expect(mocks.actions.getUserInfoOrRedirectToAuth).toHaveBeenCalledWith(
      encodeURIComponent(
        "/connect/github?code=github-code-123&installation_id=12345&setup_action=install",
      ),
    );
    expect(screen.getByText("Connect GitHub to SafeDep")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select the tenant you want to link with your GitHub installation.",
      ),
    ).toBeInTheDocument();
  });

  it("should redirect to home page when code is missing", async () => {
    // Act
    await setupPageComponent({
      searchParams: {
        installation_id: "12345",
        setup_action: "install",
        code: undefined, // code is missing
      },
    });

    // Assert
    expect(mocks.navigation.redirect).toHaveBeenCalledWith("/");
    expect(mocks.actions.getUserInfoOrRedirectToAuth).not.toHaveBeenCalled();
  });

  it("should redirect to home page when installation_id is missing", async () => {
    // Act
    await setupPageComponent({
      searchParams: {
        code: "github-code-123",
        setup_action: "install",
        installation_id: undefined, // installation_id is missing
      },
    });

    // Assert
    expect(mocks.navigation.redirect).toHaveBeenCalledWith("/");
    expect(mocks.actions.getUserInfoOrRedirectToAuth).not.toHaveBeenCalled();
  });

  it("should redirect to home page when code is empty", async () => {
    // Act
    await setupPageComponent({
      searchParams: {
        code: "",
        installation_id: "12345",
        setup_action: "install",
      },
    });

    // Assert
    expect(mocks.navigation.redirect).toHaveBeenCalledWith("/");
    expect(mocks.actions.getUserInfoOrRedirectToAuth).not.toHaveBeenCalled();
  });

  it("should redirect to home page when installation_id is empty", async () => {
    // Act
    await setupPageComponent({
      searchParams: {
        code: "github-code-123",
        installation_id: "",
        setup_action: "install",
      },
    });

    // Assert
    expect(mocks.navigation.redirect).toHaveBeenCalledWith("/");
    expect(mocks.actions.getUserInfoOrRedirectToAuth).not.toHaveBeenCalled();
  });

  it("should redirect to home page when installation_id is not a valid number", async () => {
    // Act
    await setupPageComponent({
      searchParams: {
        code: "github-code-123",
        installation_id: "not-a-number",
        setup_action: "install",
      },
    });

    // Assert
    expect(mocks.navigation.redirect).toHaveBeenCalledWith("/");
    expect(mocks.actions.getUserInfoOrRedirectToAuth).not.toHaveBeenCalled();
  });

  it("should render correctly without setup_action (optional parameter)", async () => {
    // Arrange
    mocks.actions.getUserInfoOrRedirectToAuth.mockResolvedValue({
      email: "test@example.com",
      tenants: [],
    } satisfies UserInfoResult);

    // Act
    await setupPageComponent({
      searchParams: {
        code: "github-code-123",
        installation_id: "12345",
        setup_action: undefined, // setup_action is optional
      },
    });

    // Assert
    expect(mocks.navigation.redirect).not.toHaveBeenCalled();
    expect(mocks.actions.getUserInfoOrRedirectToAuth).toHaveBeenCalledWith(
      encodeURIComponent(
        "/connect/github?code=github-code-123&installation_id=12345&setup_action=undefined",
      ),
    );
    expect(screen.getByText("Connect GitHub to SafeDep")).toBeInTheDocument();
  });

  it("should pass correct props to ConnectGithubClient", async () => {
    // Arrange
    const mockUserInfo = {
      email: "john.doe@example.com",
      tenants: [
        createMockAccess("tenant1.com"),
        createMockAccess("tenant2.com"),
      ],
    } satisfies UserInfoResult;

    mocks.actions.getUserInfoOrRedirectToAuth.mockResolvedValue(mockUserInfo);

    // Act
    await setupPageComponent({
      searchParams: {
        code: "github-auth-code",
        installation_id: "98765",
        setup_action: "configure",
      },
    });

    // Assert
    expect(mocks.navigation.redirect).not.toHaveBeenCalled();
    expect(mocks.actions.getUserInfoOrRedirectToAuth).toHaveBeenCalledWith(
      encodeURIComponent(
        "/connect/github?code=github-auth-code&installation_id=98765&setup_action=configure",
      ),
    );

    // Check that the page renders the GitHub icon and text
    expect(screen.getByText("Connect GitHub to SafeDep")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select the tenant you want to link with your GitHub installation.",
      ),
    ).toBeInTheDocument();

    // Note: We can't directly test the props passed to ConnectGithubClient
    // since it's a client component, but we can verify the user data is fetched correctly
    expect(mocks.actions.getUserInfoOrRedirectToAuth).toHaveBeenCalledOnce();
  });

  it("should handle user with no email", async () => {
    // Arrange
    mocks.actions.getUserInfoOrRedirectToAuth.mockResolvedValue({
      email: undefined,
      tenants: [createMockAccess("test.com")],
    } satisfies UserInfoResult);

    // Act
    await setupPageComponent({
      searchParams: {
        code: "github-code-123",
        installation_id: "12345",
        setup_action: "install",
      },
    });

    // Assert
    expect(mocks.navigation.redirect).not.toHaveBeenCalled();
    expect(screen.getByText("Connect GitHub to SafeDep")).toBeInTheDocument();
    // The component should still render even if email is null (converted to empty string)
  });

  it("triggers mutation and shows loading toast when connecting a tenant", async () => {
    // Arrange
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mocks.actions.getUserInfoOrRedirectToAuth.mockResolvedValue({
      email: "test@example.com",
      tenants: [createMockAccess("tenant1.com")],
    } satisfies UserInfoResult);
    // delay the action so we can observe the pending mutation state
    mocks.actions.connectTenantToGithub.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve("link-1" as never), 2_000),
        ),
    );
    mocks.toast.loading.mockReturnValue("toast-1");

    // Act
    const { queryClient } = await setupPageComponent({
      searchParams: {
        code: "github-code-123",
        installation_id: "12345",
        setup_action: "install",
      },
    });

    // open tenant select and choose an option
    const tenantSelect = screen.getByRole("combobox");
    await user.click(tenantSelect);
    const option = await screen.findByRole("option", { name: "tenant1.com" });
    await user.click(option);

    // click Connect
    const connectButton = screen.getByRole("button", { name: "Connect" });
    await user.click(connectButton);

    // Assert: mutation started and loading toast shown
    expect(queryClient.isMutating()).toBeGreaterThan(0);
    expect(mocks.toast.loading).toHaveBeenCalledWith(
      "Connecting GitHub to SafeDep...",
    );

    // Let the mutation complete
    vi.advanceTimersByTime(2_000);
    await waitFor(() => expect(queryClient.isMutating()).toBe(0));
    expect(mocks.toast.success).toHaveBeenCalledWith(
      "GitHub connected to SafeDep",
      { id: "toast-1" },
    );

    // Assert: the user is redirected to the keys page
    expect(mocks.navigation.useRouter.replace).toHaveBeenCalledWith(
      "/connect/github/success",
    );
  });
});
