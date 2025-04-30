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
import Link from "next/link";

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
    <Dialog open={true} modal onOpenChange={() => router.replace("/")}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            You&apos;re Already Onboarded
          </DialogTitle>
          <DialogDescription className="text-center">
            You have already completed the onboarding process and have access to
            your organization.
          </DialogDescription>
        </DialogHeader>

        <div className="text-muted-foreground text-center text-sm">
          Redirecting you to the dashboard in a few seconds...
        </div>

        <Button asChild className="mt-2 w-full">
          <Link href="/">Go to Dashboard Now</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
