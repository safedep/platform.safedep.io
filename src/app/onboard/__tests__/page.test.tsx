import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Onboard from "../page";
import { describe, expect, vi, type Mock, test, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  useRouter: vi.fn(),
  useUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: mocks.useRouter,
}));

vi.mock("@auth0/nextjs-auth0", () => ({
  useUser: mocks.useUser,
}));

global.fetch = vi.fn();

const placeholderText = {
  name: "John Doe",
  organization: "Example Inc",
  domain: "example.com",
};

describe("Onboard Component", () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockUser = {
    name: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useRouter.mockReturnValue(mockRouter);
    mocks.useUser.mockReturnValue({
      user: mockUser,
      isLoading: false,
    });
  });

  test("renders onboarding form with user name", () => {
    render(<Onboard />);
    expect(
      screen.getByText(
        `Welcome, ${mockUser.name}! Please fill in the details to onboard.`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholderText.name),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholderText.organization),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholderText.domain),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  test("redirects to home page when no user is logged in", () => {
    mocks.useUser.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<Onboard />);
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  test("handles form submission successfully", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ domain: "example.com" }),
    });

    render(<Onboard />);

    fireEvent.change(screen.getByPlaceholderText(placeholderText.name), {
      target: { value: placeholderText.name },
    });

    fireEvent.change(
      screen.getByPlaceholderText(placeholderText.organization),
      {
        target: { value: placeholderText.organization },
      },
    );

    fireEvent.change(screen.getByPlaceholderText(placeholderText.domain), {
      target: { value: placeholderText.domain },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: placeholderText.name,
          organizationName: placeholderText.organization,
          organizationDomain: placeholderText.domain,
        }),
      });
    });
  });

  test("handles form submission error", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: "Error details" }),
    });

    const consoleErrorSpy = vi.spyOn(console, "error");

    render(<Onboard />);
    fireEvent.change(screen.getByPlaceholderText(placeholderText.name), {
      target: { value: placeholderText.name },
    });

    fireEvent.change(
      screen.getByPlaceholderText(placeholderText.organization),
      {
        target: { value: placeholderText.organization },
      },
    );

    fireEvent.change(screen.getByPlaceholderText(placeholderText.domain), {
      target: { value: placeholderText.domain },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("ERROR: Failed to onboard"),
        expect.any(Object),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("handles network error during submission", async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error("Network error"));
    const consoleErrorSpy = vi.spyOn(console, "error");

    render(<Onboard />);

    fireEvent.change(screen.getByPlaceholderText(placeholderText.name), {
      target: { value: placeholderText.name },
    });

    fireEvent.change(
      screen.getByPlaceholderText(placeholderText.organization),
      {
        target: { value: placeholderText.organization },
      },
    );

    fireEvent.change(screen.getByPlaceholderText(placeholderText.domain), {
      target: { value: placeholderText.domain },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("ERROR: Error occurred while onboarding"),
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("logout link is present", () => {
    render(<Onboard />);
    expect(screen.getByRole("link", { name: "Sign out" })).toBeInTheDocument();
  });
});
