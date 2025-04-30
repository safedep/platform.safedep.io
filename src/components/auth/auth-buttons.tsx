import React from "react";
import { Button } from "@/components/ui/button";
import { LockIcon, UserPlus } from "lucide-react";

export default function AuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      <Button
        className="flex w-full items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
        size="lg"
        asChild
      >
        <a href="/auth/login?screen_hint=signup">
          <UserPlus className="h-5 w-5" />
          Create Account
        </a>
      </Button>

      <div className="relative flex items-center justify-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-sm text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <Button
        className="flex w-full items-center justify-center gap-2 border-2 bg-transparent text-gray-800 hover:bg-gray-100"
        size="lg"
        variant="outline"
        asChild
      >
        <a href="/auth/login">
          <LockIcon className="h-5 w-5" />
          Login
        </a>
      </Button>
    </div>
  );
}
