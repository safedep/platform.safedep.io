"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useUser } from "@auth0/nextjs-auth0";
import { AlertTriangle } from "lucide-react";

// This is the dialog that is shown when the user is already onboarded
export function AlreadyOnboardedDialog() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center text-xl">
            You're Already Onboarded!
          </DialogTitle>
          <DialogDescription className="text-center">
            <span>
              You have already completed the onboarding process and have access
              to your organization.
            </span>
          </DialogDescription>

          <div className="mt-4 text-sm text-center text-muted-foreground">
            Redirecting you to the dashboard in a few seconds...
          </div>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.replace("/")} className="w-full">
            Go to Dashboard Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Check every 5 minutes for session expiration
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface AuthError extends Error {
  name: "AuthenticationError";
}

export function SessionExpirationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, error } = useUser();

  useEffect(() => {
    function checkSession() {
      // Only check if we're not already showing the dialog
      if (!isOpen && !isLoading) {
        if (
          !user ||
          (error && (error as AuthError).name === "AuthenticationError")
        ) {
          setIsOpen(true);
        }
      }
    }
    // Initial check
    checkSession();
    const interval = setInterval(checkSession, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [user, isLoading, error, isOpen]);

  if (isLoading) {
    return null;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="border-yellow-500 bg-yellow-50">
        <AlertDialogHeader className="flex flex-row items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <AlertDialogTitle className="text-yellow-800">
            Session Expired
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-yellow-700">
          <span className="block mb-2">
            Your session has expired due to inactivity or security reasons.
          </span>
          <span className="block text-sm text-yellow-600">
            Redirecting you to the login page...
          </span>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
