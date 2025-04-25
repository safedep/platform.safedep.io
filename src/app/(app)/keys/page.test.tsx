import { afterEach, describe, expect, it, vi } from "vitest";
import Page from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ApiKeys, getUserInfo } from "./actions";
import userEvent from "@testing-library/user-event";

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

  it("should display API keys", async () => {
    // Arrange
    // set response for api keys listing action
    mocks.actions.getApiKeys.mockResolvedValue({
      tenant: "some-tenant",
      apiKeys: [
        {
          id: "1",
          description: "description of my-api-key",
          expiresAt: new Date("2025-05-01"),
          name: "my-api-key",
        },
        {
          id: "2",
          description: "", // will be displayed as "—"
          expiresAt: new Date("2025-05-02"),
          name: "my-api-key-2",
        },
      ],
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
    // current tenant
    mocks.session.sessionGetTenant.mockResolvedValue("some-tenant");

    // Act
    const { page, queryClient } = await setupPageComponent();
    render(page);
    await waitFor(() => {
      // wait for the query client to resolve all queries
      expect(queryClient.isFetching()).toBe(0);
    });

    // Assert
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // get columns
    const columns = screen.getAllByRole("columnheader");
    expect(columns).toHaveLength(5);
    expect(columns[0]).toHaveTextContent("ID");
    expect(columns[1]).toHaveTextContent("Name");
    expect(columns[2]).toHaveTextContent("Description");
    expect(columns[3]).toHaveTextContent("Expires At");
    expect(columns[4]).toHaveTextContent(""); // actions column

    // get rows
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3); // 0-th row is the header

    // get cells for the first row
    const row = rows[1]; // 0-th row is the header
    const cells = row.querySelectorAll("td");
    expect(cells).toHaveLength(5);
    expect(cells[0]).toHaveTextContent("1");
    expect(cells[1]).toHaveTextContent("my-api-key");
    expect(cells[2]).toHaveTextContent("description of my-api-key");
    // TODO: how to test the date in locale compatible way?

    // get cells for the second row
    const row2 = rows[2]; // 0-th row is the header
    const cells2 = row2.querySelectorAll("td");
    expect(cells2).toHaveLength(5);
    expect(cells2[0]).toHaveTextContent("2");
    expect(cells2[1]).toHaveTextContent("my-api-key-2");
    expect(cells2[2]).toHaveTextContent("—");
    // TODO: how to test the date in locale compatible way?
  });

  it("should display a message in table if no API keys are found", async () => {
    // Arrange
    mocks.actions.getApiKeys.mockResolvedValue({
      tenant: "some-tenant",
      apiKeys: [],
    } satisfies ApiKeys);
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
    const { page, queryClient } = await setupPageComponent();
    render(page);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    // Assert
    expect(screen.getByText(/\bNo API keys found\b/)).toBeInTheDocument();
  });

  it("should display a dialog box when deleting an API key", async () => {
    // Arrange
    mocks.session.sessionGetTenant.mockResolvedValue("some-tenant");
    mocks.actions.getUserInfo.mockResolvedValue({
      userInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://example.com/avatar.png",
      },
      tenants: [],
      currentTenant: "some-tenant",
    } satisfies UserInfo);
    mocks.actions.getApiKeys.mockResolvedValue({
      tenant: "some-tenant",
      apiKeys: [
        {
          id: "my-api-key-id",
          name: "my-api-key",
          description: "description of my-api-key",
          expiresAt: new Date("2025-05-01"),
        },
      ],
    } satisfies ApiKeys);
    const user = userEvent.setup();

    // Act
    const { page, queryClient } = await setupPageComponent();
    render(page);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    // Assert
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(2); // 0-th row is the header

    // get the row at index 1 (that contains our api-key data)
    const row1 = rows[1];

    // get the button inside the actions cell
    const actionsButton = within(row1).getByRole("button");
    await user.click(actionsButton);

    // find the delete button within the actions cell
    const deleteButton = screen.getByRole("menuitem", {
      name: "Delete Key",
    });
    await user.click(deleteButton);

    // now a dialog box is open, find the confirm delete button
    const confirmDeleteButton = screen.getByRole("button", {
      name: "Delete",
    });
    await user.click(confirmDeleteButton);

    expect(mocks.actions.deleteApiKey).toHaveBeenCalledWith("my-api-key-id");
  });
});
