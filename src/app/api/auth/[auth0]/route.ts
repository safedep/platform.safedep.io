import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
// export Auth0's default handleAuth with custom action for
// sign-up to render the sign-up screen by default
export const GET = handleAuth({
  signup: handleLogin({
    authorizationParams: {
      screen_hint: "signup",
    },
  }),

  login: handleLogin({
    authorizationParams: {
      scope: "openid profile email offline_access",
    },
  }),

  // https://github.com/SuhravHussen/UmmahrChintah/blob/bb79e4f97c782ce2572f28afa72c17dad9469ed8/client/app/api/auth/%5Bauth0%5D/route.ts
  onError: async (req: NextRequest) => {
    const url = new URL(req.url);
    const errorType = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description") || "";

    if (
      errorType === "access_denied" &&
      errorDescription?.includes("verify your email")
    ) {
      return NextResponse.redirect(
        new URL(`/auth/verify-email`, process.env.NEXT_PUBLIC_URL || req.url),
      );
    }

    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent(errorDescription)}`,
        process.env.NEXT_PUBLIC_URL || req.url,
      ),
    );
  },
});
