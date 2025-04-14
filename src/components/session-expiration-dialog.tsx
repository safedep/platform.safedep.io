"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useUser } from "@auth0/nextjs-auth0";
import { AlertTriangle } from "lucide-react";
import { AuthorizationError } from "@auth0/nextjs-auth0/errors";

// Check every 5 minutes for session expiration
const CHECK_INTERVAL = 5 * 60 * 1000;

export default function SessionExpirationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, error } = useUser();

  useEffect(() => {
    function checkSession() {
      // Only check if we're not already showing the dialog
      if (!isOpen && !isLoading) {
        const authError = error as AuthorizationError;
        if (!user || (authError && authError.name === "AuthorizationError")) {
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
