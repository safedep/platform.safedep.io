import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  actions: {
    isUserOnboarded: vi.fn(),
  },
  session: {
    sessionRequireAuth: vi.fn(),
  },
  navigation: {
    redirect: vi.fn(),
    useRouter: {
      replace: vi.fn(),
    },
  },
}));

vi.mock("server-only", () => ({}));

vi.mock("./actions", () => ({
  isUserOnboarded: mocks.actions.isUserOnboarded,
}));

vi.mock("@/lib/session/session", () => ({
  sessionRequireAuth: mocks.session.sessionRequireAuth,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.navigation.useRouter,
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
    const user = userEvent.setup();

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
});
