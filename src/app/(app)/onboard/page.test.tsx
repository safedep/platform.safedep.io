import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  actions: {
    isUserOnboarded: vi.fn(),
    createOnboarding: vi.fn(),
  },
  session: {
    sessionRequireAuth: vi.fn(),
  },
  navigation: {
    redirect: vi.fn(),
    useRouter: {
      replace: vi.fn(),
      push: vi.fn(),
    },
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("server-only", () => ({}));

vi.mock("./actions", () => ({
  isUserOnboarded: mocks.actions.isUserOnboarded,
  createOnboarding: mocks.actions.createOnboarding,
}));

vi.mock("@/lib/session/session", () => ({
  sessionRequireAuth: mocks.session.sessionRequireAuth,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.navigation.useRouter,
}));

vi.mock("sonner", () => ({
  toast: {
    success: mocks.toast.success,
    error: mocks.toast.error,
  },
}));

async function setupPageComponent() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const page = await Page();
  return {
    page: (
      <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>
    ),
    queryClient,
  };
}

describe("Onboard page", () => {
  // https://github.com/testing-library/user-event/issues/1115#issuecomment-2495876991
  // Need this for checking pending state in the button during form submission.
  beforeAll(() => {
    // https://vitest.dev/api/vi.html#vi-stubglobal
    vi.stubGlobal("jest", {
      advanceTimersByTime: vi.advanceTimersByTime,
    });
  });
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.resetAllMocks();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should render", async () => {
    // arrange
    mocks.session.sessionRequireAuth.mockResolvedValue({
      user: { email: "test@test.com" },
      tokenSet: { accessToken: "test-access-token" },
    } as SessionData);

    // act
    const { page } = await setupPageComponent();
    render(page);

    // assert
    expect(mocks.actions.isUserOnboarded).toHaveBeenCalled();
  });

  it("should show already onboarded dialog if user is already onboarded", async () => {
    // arrange
    mocks.actions.isUserOnboarded.mockResolvedValue(true);
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // act
    const { page } = await setupPageComponent();
    render(page);

    // assert
    expect(mocks.actions.isUserOnboarded).toHaveBeenCalled();
    expect(screen.getByText(/You're Already Onboarded/i)).toBeInTheDocument();

    // get the close dialog button
    const closeDialogButton = screen.getByRole("button");
    await user.click(closeDialogButton);
    expect(mocks.navigation.useRouter.replace).toHaveBeenCalledWith("/");
  });

  it("should show onboarding form if user is not onboarded", async () => {
    // arrange
    mocks.session.sessionRequireAuth.mockResolvedValue({
      user: { email: "test@test.com" },
      tokenSet: { accessToken: "test-access-token" },
    } as SessionData);
    mocks.actions.isUserOnboarded.mockResolvedValue(false);
    mocks.actions.createOnboarding.mockResolvedValue({
      tenant: "test-tenant",
    });
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // act
    const { page, queryClient } = await setupPageComponent();
    render(page);

    // find the name input
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    // find the organization name input
    const organizationNameInput = screen.getByRole("textbox", {
      name: "Organization Name",
    });
    await user.type(organizationNameInput, "Acme Inc.");
    // find the organization domain input
    const organizationDomainInput = screen.getByRole("textbox", {
      name: "Organization Domain",
    });
    await user.type(organizationDomainInput, "acme.com");
    // find the submit button
    const submitButton = screen.getByRole("button", {
      name: "Create Organization",
    });
    await user.click(submitButton);

    // let the mutation finish
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0);
    });

    // assert
    expect(mocks.actions.createOnboarding).toHaveBeenCalledWith({
      name: "John Doe",
      organizationName: "Acme Inc.",
      organizationDomain: "acme.com",
      email: "test@test.com", // comes from the session
    });
    expect(mocks.navigation.useRouter.push).toHaveBeenCalledWith("/");
    expect(mocks.toast.success).toHaveBeenCalled();
  });

  it("should show disabled button if form is submitting", async () => {
    // arrange
    mocks.session.sessionRequireAuth.mockResolvedValue({
      user: { email: "test@test.com" },
      tokenSet: { accessToken: "test-access-token" },
    } as SessionData);
    mocks.actions.isUserOnboarded.mockResolvedValue(false);
    mocks.actions.createOnboarding.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ tenant: "test-tenant" }), 5_000),
        ),
    );

    // tell userEvent how to advance our fake timers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    const { page, queryClient } = await setupPageComponent();
    render(page);

    // fill the form
    await user.type(screen.getByRole("textbox", { name: "Name" }), "John Doe");
    await user.type(
      screen.getByRole("textbox", { name: "Organization Name" }),
      "Acme Inc.",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Organization Domain" }),
      "acme.com",
    );

    // Act
    const submitButton = screen.getByRole("button", {
      name: "Create Organization",
    });
    await user.click(submitButton);

    // Assert: button should be disabled and show "Creating..."
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Creating.../i);
    // still disabled after 1 second
    vi.advanceTimersByTime(1_000);
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Creating.../i);
    // let the server action finish
    vi.runAllTimers();

    await waitFor(() => {
      // the mutation should be finished
      expect(queryClient.isMutating()).toBe(0);
    });
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent(/Create Organization/i);
  });

  it("should show error toast if onboarding form submission fails", async () => {
    // arrange
    mocks.session.sessionRequireAuth.mockResolvedValue({
      user: { email: "test@test.com" },
      tokenSet: { accessToken: "test-access-token" },
    } as SessionData);
    mocks.actions.isUserOnboarded.mockResolvedValue(false);
    mocks.actions.createOnboarding.mockResolvedValue({
      error: "test-error",
    });
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // act
    const { page, queryClient } = await setupPageComponent();
    render(page);

    // find the name input
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    // find the organization name input
    const organizationNameInput = screen.getByRole("textbox", {
      name: "Organization Name",
    });
    await user.type(organizationNameInput, "Acme Inc.");
    // find the organization domain input
    const organizationDomainInput = screen.getByRole("textbox", {
      name: "Organization Domain",
    });
    await user.type(organizationDomainInput, "acme.com");
    // find the submit button
    const submitButton = screen.getByRole("button", {
      name: "Create Organization",
    });
    await user.click(submitButton);

    // let the mutation finish
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0);
    });

    // assert
    expect(mocks.actions.createOnboarding).toHaveBeenCalledWith({
      name: "John Doe",
      organizationName: "Acme Inc.",
      organizationDomain: "acme.com",
      email: "test@test.com", // comes from the session
    });
    expect(mocks.toast.error).toHaveBeenCalled();
  });

  it("handles unexpected error during submission", async () => {
    // arrange
    mocks.actions.createOnboarding.mockRejectedValueOnce(
      new Error("Network Error"),
    );
    mocks.session.sessionRequireAuth.mockResolvedValue({
      user: { email: "test@test.com" },
      tokenSet: { accessToken: "test-access-token" },
    } as SessionData);
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // act
    const { page, queryClient } = await setupPageComponent();
    render(page);

    // find the name input
    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await user.type(nameInput, "John Doe");
    // find the organization name input
    const organizationNameInput = screen.getByRole("textbox", {
      name: "Organization Name",
    });
    await user.type(organizationNameInput, "Acme Inc.");
    // find the organization domain input
    const organizationDomainInput = screen.getByRole("textbox", {
      name: "Organization Domain",
    });
    await user.type(organizationDomainInput, "networkerror.com");
    // find the submit button
    const submitButton = screen.getByRole("button", {
      name: "Create Organization",
    });
    await user.click(submitButton);

    // let the mutation finish
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0);
    });

    // assert
    expect(mocks.toast.error).toHaveBeenCalledWith(
      "Failed to create organization",
      {
        description: "Network Error",
      },
    );
  });
});
