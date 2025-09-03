import { describe, it, expect } from "vitest";
import AuthPage from "./page";
import { render, screen } from "@testing-library/react";

describe("Auth Page", () => {
  it("should render the page", () => {
    // Arrange
    render(<AuthPage />);

    // Assert
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("has links to the login and signup pages", () => {
    // Arrange
    render(<AuthPage />);

    // Assert
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
