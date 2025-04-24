import { Mail, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Email | Safedep Platform",
  description: "Verify your email to continue",
};

export default async function Page() {
  // Check if the user is already logged in and verified
  const session = await auth0.getSession();

  // If user is logged in and email is verified, redirect to dashboard
  if (session?.user?.email_verified) {
    return redirect("/");
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="space-y-6 text-center">
          {/* Icon */}
          <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Mail className="h-8 w-8" />
          </div>

          <CardHeader className="space-y-2 px-6 pt-0 pb-0">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Verify your email
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              We have sent a verification link to the email address you
              provided. Please check your inbox to proceed.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pt-0">
            {/* Steps */}
            <div className="space-y-4 py-4">
              {[
                "Open your email inbox",
                "Click the verification link we sent you",
                "Return here to continue",
              ].map((text, index) => (
                <div
                  key={text}
                  className="flex items-center space-x-3 text-left"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <span className="font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-600">{text}</p>
                </div>
              ))}
            </div>

            {/* Divider with text */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-gray-500">
                  Already verified?
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="group w-full" size="lg" asChild>
                <a href="/auth/login">
                  Continue to Login
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button className="w-full" variant="outline" size="lg" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>

            {/* Help text */}
            <p className="pt-2 text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or try to
              login again to resend the verification email.
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
