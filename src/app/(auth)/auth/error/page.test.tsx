import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AuthError from "./page";
import { describe, it, expect, vi, type Mock } from "vitest";

// Mock useSearchParams from next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("AuthError Component", () => {
  it("renders with a default error message when no message is provided", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });

    render(<AuthError />);

    expect(screen.getByText("Authentication Error")).toBeInTheDocument();
    expect(screen.getByText("An unknown error occurred")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Return to Sign In/i }),
    ).toBeInTheDocument();
  });

  it("renders with a specific error message from search params", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(encodeURIComponent("Invalid credentials")),
    });

    render(<AuthError />);

    expect(screen.getByText("Authentication Error")).toBeInTheDocument();
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Return to Sign In/i }),
    ).toBeInTheDocument();
  });

  it("renders the fallback loading state", () => {
    (useSearchParams as Mock).mockImplementation(() => {
      throw new Promise(() => {}); // Never resolves, forcing Suspense
    });

    const { container } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <AuthError />
      </Suspense>,
    );

    expect(container).toHaveTextContent("Loading...");
  });
});
