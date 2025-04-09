"use client";

import { useEffect } from "react";
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

// This is the dialog that is shown when the user is already onboarded
export default function AlreadyOnboardedDialog() {
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
            You&apos;re Already Onboarded!
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
