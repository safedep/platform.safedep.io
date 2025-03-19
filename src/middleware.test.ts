import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { middleware } from "./middleware";
import { auth0 } from "./lib/auth0";

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
    } as unknown as NextRequest;
    
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it("redirects to verify-email page when error type is access_denied and error description mentions email verification", async () => {
    // Setup request with error parameters for email verification
    mockRequest.nextUrl.searchParams.set("error", "access_denied");
    mockRequest.nextUrl.searchParams.set("error_description", "Please verify your email before logging in");
    
    await middleware(mockRequest);
    
    // Verify redirect to verify-email page
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/auth/verify-email",
      })
    );
  });
  
  it("redirects to verify-email page when user is logged in but email is not verified", async () => {
    // Mock auth0.getSession to return unverified user
    (auth0.getSession as any).mockResolvedValue({
      user: {
        email: "test@example.com",
        email_verified: false,
      },
    });
    
    await middleware(mockRequest);
    
    // Verify redirect to verify-email page
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/auth/verify-email",
      })
    );
  });
  
  it("does not redirect when user is on the verify-email page already", async () => {
    // Set up an unverified user on the verify-email page
    mockRequest.nextUrl.pathname = "/auth/verify-email";
    
    (auth0.getSession as any).mockResolvedValue({
      user: {
        email: "test@example.com",
        email_verified: false,
      },
    });
    
    await middleware(mockRequest);
    
    // Verify no redirect occurs
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
  
  it("does not redirect when user's email is verified", async () => {
    // Mock auth0.getSession to return verified user
    (auth0.getSession as any).mockResolvedValue({
      user: {
        email: "test@example.com",
        email_verified: true,
      },
    });
    
    await middleware(mockRequest);
    
    // Verify no redirect occurs
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
  
  it("passes through to auth0.middleware when no email verification issues", async () => {
    const mockResponse = { headers: new Map() };
    (auth0.middleware as any).mockResolvedValue(mockResponse);
    (auth0.getSession as any).mockResolvedValue({
      user: {
        email: "test@example.com",
        email_verified: true,
      },
    });
    
    const result = await middleware(mockRequest);
    
    // Verify auth0.middleware was called
    expect(auth0.middleware).toHaveBeenCalledWith(mockRequest);
    // Verify the response from auth0.middleware is returned
    expect(result).toBe(mockResponse);
  });
}); 