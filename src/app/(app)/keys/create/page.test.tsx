import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
      back: vi.fn(),
    },
  },
  toast: {
    promise: vi.fn(),
    success: vi.fn(),
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

vi.mock("sonner", () => ({
  toast: mocks.toast,
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
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.resetAllMocks();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should render", async () => {
    const { page } = await setupPageComponent();
    render(page);
  });

  it("should navigate back when the cancel button is clicked", async () => {
    // arrange
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // act: click the cancel button
    const { page } = await setupPageComponent();
    render(page);
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    // assert: the router.back function is called
    expect(mocks.navigation.useRouter.back).toHaveBeenCalled();
  });

  it("should submit the create key form", async () => {
    // arrange
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });
    mocks.actions.createApiKey.mockResolvedValue({
      keyId: "test-key-id",
      key: "test-key",
      tenant: "test-tenant",
    });
    vi.spyOn(navigator.clipboard, "writeText");

    // act
    const { page, queryClient } = await setupPageComponent();
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

    // wait for the mutation to finish
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0);
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

    // find the back button and click it
    const backButton = screen.getByRole("button", { name: "Back" });
    await user.click(backButton);
    // assert: the router.back function is called
    expect(mocks.navigation.useRouter.back).toHaveBeenCalled();
  });

  it("should show disabled button if form is submitting", async () => {
    // arrange
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });
    // mock the createApiKey action to take 5 seconds to resolve
    mocks.actions.createApiKey.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                keyId: "test-key-id",
                key: "test-key",
                tenant: "test-tenant",
              }),
            5_000,
          ),
        ),
    );

    // act
    const { page, queryClient } = await setupPageComponent();
    render(page);

    // fill the form
    await user.type(screen.getByRole("textbox", { name: "Name" }), "test-key");
    await user.type(
      screen.getByRole("textbox", { name: "Description" }),
      "test-description",
    );

    // select the create button
    const createButton = screen.getByRole("button", { name: "Create" });
    await user.click(createButton);

    // assert: the button should be disabled and show "Creating..."
    expect(createButton).toBeDisabled();
    expect(createButton).toHaveTextContent(/Creating.../i);
    // still disabled after 1 second
    vi.advanceTimersByTime(1_000);
    expect(createButton).toBeDisabled();
    expect(createButton).toHaveTextContent(/Creating.../i);
    // let the server action finish
    vi.runAllTimers();

    // wait for the mutation to finish
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0);
    });

    // assert the key created modal is shown
    expect(
      screen.getByText("Your API key has been created successfully."),
    ).toBeInTheDocument();
    expect(screen.getByText("test-tenant")).toBeInTheDocument();

    // find the back button and click it
    const backButton = screen.getByRole("button", { name: "Back" });
    await user.click(backButton);
    // assert: the router.back function is called
    expect(mocks.navigation.useRouter.back).toHaveBeenCalled();
  });

  it("should show error if the createApiKey action fails with expected error", async () => {
    // arrange
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });
    mocks.actions.createApiKey.mockResolvedValue({
      error: "test-error",
    });

    // act
    const { page, queryClient } = await setupPageComponent();
    render(page);

    // select the name input
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "test-key");

    // select the description input
    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    await user.type(descriptionInput, "test-description");

    // select the create button and press it
    const createButton = screen.getByRole("button", { name: "Create" });
    await user.click(createButton);

    // wait for the mutation to finish
    await waitFor(async () => {
      expect(queryClient.isMutating()).toBe(0);
    });

    // assert: the error message is shown
    expect(mocks.toast.promise).toHaveBeenCalled();
    const rejectedPromise = mocks.toast.promise.mock.calls[0][0]; // get the rejected promise
    await expect(rejectedPromise).rejects.toThrow("test-error");
  });

  it("should show error if the createApiKey action fails with unexpected error", async () => {
    // arrange
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });
    mocks.actions.createApiKey.mockRejectedValue(new Error("test-error"));

    // act
    const { page, queryClient } = await setupPageComponent();
    render(page);

    // select the name input
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "test-key");

    // select the description input
    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    await user.type(descriptionInput, "test-description");

    // select the create button and press it
    const createButton = screen.getByRole("button", { name: "Create" });
    await user.click(createButton);

    // wait for the mutation to finish
    await waitFor(async () => {
      expect(queryClient.isMutating()).toBe(0);
    });

    // assert: the error message is shown
    expect(mocks.toast.promise).toHaveBeenCalled();
    const rejectedPromise = mocks.toast.promise.mock.calls[0][0]; // get the rejected promise
    await expect(rejectedPromise).rejects.toThrow("test-error");
  });
});
