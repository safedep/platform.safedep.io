import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { middleware } from "./middleware";
import { auth0 } from "./lib/auth0";

// Define types for mocked objects
type MockedSession = {
  user: {
    email: string;
    email_verified: false | true;
    [key: string]: unknown;
  };
};

type MockedResponse = {
  headers: Map<string, string>;
  [key: string]: unknown;
};

// Mock next/server and auth0
vi.mock("next/server", async () => {
  const actual = await vi.importActual("next/server");
  return {
    ...actual,
    NextResponse: {
      next: vi.fn(() => ({ headers: new Map() })),
      redirect: vi.fn((url) => ({ redirectUrl: url })),
    },
  };
});

vi.mock("./lib/auth0", () => ({
  auth0: {
    middleware: vi.fn(() => Promise.resolve({ headers: new Map() })),
    getSession: vi.fn(),
  },
}));

describe("Middleware", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = {
      nextUrl: {
        pathname: "/",
        searchParams: new URLSearchParams(),
        href: "http://localhost:3000",
      },
      url: "http://localhost:3000",
    } as NextRequest;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("redirects to verify-email page when error type is access_denied and error description mentions email verification", async () => {
    // Setup request with error parameters for email verification
    mockRequest.nextUrl.searchParams.set("error", "access_denied");
    mockRequest.nextUrl.searchParams.set(
      "error_description",
      "Please verify your email before logging in",
    );

    await middleware(mockRequest);

    // Verify redirect to verify-email page
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/auth/verify-email",
      }),
    );
  });

  it("redirects to verify-email page when user is logged in but email is not verified", async () => {
    // Mock auth0.getSession to return unverified user
    const mockSession: MockedSession = {
      user: {
        email: "test@example.com",
        email_verified: false,
      },
    };
    (auth0.getSession as Mock).mockResolvedValue(mockSession);

    await middleware(mockRequest);

    // Verify redirect to verify-email page
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/auth/verify-email",
      }),
    );
  });

  it("does not redirect when user is on the verify-email page already", async () => {
    // Set up an unverified user on the verify-email page
    mockRequest.nextUrl.pathname = "/auth/verify-email";

    const mockSession: MockedSession = {
      user: {
        email: "test@example.com",
        email_verified: false,
      },
    };
    (auth0.getSession as Mock).mockResolvedValue(mockSession);

    await middleware(mockRequest);

    // Verify no redirect occurs
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("does not redirect when user's email is verified", async () => {
    // Mock auth0.getSession to return verified user
    const mockSession: MockedSession = {
      user: {
        email: "test@example.com",
        email_verified: true,
      },
    };
    (auth0.getSession as Mock).mockResolvedValue(mockSession);

    await middleware(mockRequest);

    // Verify no redirect occurs
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("passes through to auth0.middleware when no email verification issues", async () => {
    const mockResponse: MockedResponse = { headers: new Map() };
    (auth0.middleware as Mock).mockResolvedValue(mockResponse);

    const mockSession: MockedSession = {
      user: {
        email: "test@example.com",
        email_verified: true,
      },
    };
    (auth0.getSession as Mock).mockResolvedValue(mockSession);

    const result = await middleware(mockRequest);

    // Verify auth0.middleware was called
    expect(auth0.middleware).toHaveBeenCalledWith(mockRequest);
    // Verify the response from auth0.middleware is returned
    expect(result).toBe(mockResponse);
  });
});
