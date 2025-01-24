import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Auth from "../page";

describe("AuthPage", () => {
  it("renders welcome text", () => {
    render(<Auth />);

    const heading = screen.getByRole("heading", {
      name: /welcome to safedep/i,
    });
    expect(heading).toBeDefined();

    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/api/auth/login");

    const signupLink = screen.getByRole("link", { name: /create account/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/api/auth/signup");
  });
});
