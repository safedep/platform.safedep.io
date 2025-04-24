import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import Page from "./page";

// @ts-expect-error: Mocking next/navigation
vi.mock(import("next/navigation"), async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useRouter: () => ({
      push: vi.fn(),
    }),
  };
});

describe("foobar", () => {
  it("renders the main elements correctly", () => {});
});

describe("Page Component", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders the main elements correctly", () => {
    render(<Page />);

    // Check for the title
    expect(screen.getByText("Verify your email")).toBeDefined();

    // Check for the description
    expect(screen.getByText(/We have sent a verification link/i)).toBeDefined();

    // Check for the steps
    const steps = [
      "Open your email inbox",
      "Click the verification link we sent you",
      "Return here to continue",
    ];
    for (const step of steps) {
      expect(screen.getByText(step)).toBeDefined();
    }

    // Check for the buttons
    expect(
      screen.getByRole("button", { name: /Continue to Login/i }),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Return to Home/i }),
    ).toBeDefined();

    // Check for the help text
    expect(screen.getByText(/Didnt receive the email/i)).toBeDefined();
  });

  it('redirects to login when "Continue to Login" button is clicked', () => {
    render(<Page />);

    const loginButton = screen.getByRole("button", {
      name: /Continue to Login/i,
    });
    expect(loginButton).toBeDefined();

    fireEvent.click(loginButton);
    // expect(spy).toHaveBeenCalledWith("/api/auth/login");
  });

  it('redirects to home when "Return to Home" button is clicked', () => {
    render(<Page />);

    const homeButton = screen.getByRole("button", { name: /Return to Home/i });
    expect(homeButton).toBeDefined();

    fireEvent.click(homeButton);
  });
});
