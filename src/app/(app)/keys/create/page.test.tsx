import { describe, expect, it, vi } from "vitest";
import Page from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  session: {
    sessionRequireAuth: vi.fn(),
  },
  actions: {
    createApiKey: vi.fn(),
  },
  navigation: {
    useRouter: {
      push: vi.fn(),
    },
  },
}));

vi.mock("@/lib/session/session", () => ({
  sessionRequireAuth: mocks.session.sessionRequireAuth,
}));

vi.mock("./actions", () => ({
  createApiKey: mocks.actions.createApiKey,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.navigation.useRouter,
}));

// shadcn combobox uses hasPointerCapture internally which is not supported in
// simulated environments
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

async function setupPageComponent() {
  const page = await Page();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return {
    page: (
      <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>
    ),
    queryClient,
  };
}

describe("Keys Create Page", () => {
  it("should render", async () => {
    const { page } = await setupPageComponent();
    render(page);
  });

  it("should submit the create key form", async () => {
    // arrange
    const user = userEvent.setup();
    mocks.actions.createApiKey.mockResolvedValue({
      keyId: "test-key-id",
      key: "test-key",
      tenant: "test-tenant",
    });
    vi.spyOn(navigator.clipboard, "writeText");

    // act
    const { page } = await setupPageComponent();
    render(page);

    // select the name input
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "test-key");

    // select the description input
    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    await user.type(descriptionInput, "test-description");

    // select the expiry select
    const expiresAtSelect = screen.getByRole("combobox", {
      name: "Expiry",
    });
    await user.click(expiresAtSelect);
    // select the 30 days option
    const expiresAtOption = screen.getByRole("option", {
      name: "30 days",
    });
    await user.click(expiresAtOption);

    // select the create button
    const createButton = screen.getByRole("button", { name: "Create" });
    await user.click(createButton);

    // assert
    expect(mocks.actions.createApiKey).toHaveBeenCalledWith({
      name: "test-key",
      description: "test-description",
      expiryDays: 30,
    });

    // assert the key created modal is shown
    expect(screen.getByText("API Key Created")).toBeInTheDocument();
    expect(screen.getByText("test-tenant")).toBeInTheDocument();

    // find by label "API Key" and verify the tenant value
    const tenantLabelGroup = await screen.findByRole("group", {
      name: "Current Tenant",
    });
    const div = within(tenantLabelGroup).getByText("test-tenant");
    expect(div).toHaveTextContent("test-tenant");
    // copy the tenant value
    const copyTenantButton = within(tenantLabelGroup).getByRole("button", {
      name: "Copy",
    });
    await user.click(copyTenantButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test-tenant");

    // find by label "API Key" and verify the key value
    const keyLabelGroup = await screen.findByRole("group", {
      name: "API Key",
    });
    const showKeyButton = within(keyLabelGroup).getByRole("button", {
      name: "Show API key",
    });
    await user.click(showKeyButton);
    // copy the key value
    const copyKeyButton = within(keyLabelGroup).getByRole("button", {
      name: "Copy",
    });
    await user.click(copyKeyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test-key");

    // wait for the transition to complete
    await waitFor(() => {
      expect(
        within(keyLabelGroup).queryByRole("button", {
          name: "Hide API key",
        }),
      ).toBeInTheDocument();
    });

    // TODO: get the actual API key value and verify it. The value is broken
    // into multiple span elements, hence it's not possible to use getByText
    // to verify the value.
  });
});
