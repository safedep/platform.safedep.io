import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe } from "node:test";
import Auth from "../page";

describe("AuthPage", () => {
  it("renders welcome text", () => {
    render(<Auth />);

    const heading = screen.getByRole("heading", {
      name: /welcome to safedep/i,
    });
    expect(heading).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/api/auth/login");

    const signupLink = screen.getByRole("link", { name: /create account/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/api/auth/signup");
  });
});
