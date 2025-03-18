import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Auth from "./page";
import { act } from "react";

vi.mock("server-only", () => ({}));

vi.mock("@/env", () => ({
  env: {
    AUTH0_CLIENT_ID: "test",
  },
}));

describe("AuthPage", () => {
  it("renders welcome text", async () => {
    await act(async () => {
      render(<Auth />);
    });
    const heading = screen.getByRole("heading", {
      name: /welcome to safedep/i,
    });
    expect(heading).toBeDefined();

    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/auth/login");

    const signupLink = screen.getByRole("link", { name: /create account/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute(
      "href",
      "/auth/login?screen_hint=signup",
    );
  });
});
