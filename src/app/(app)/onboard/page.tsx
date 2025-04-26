import OnboardClient from "./client";
import AlreadyOnboardedDialog from "@/components/onboarding/already-onboarded-dialog";
import { sessionRequireAuth } from "@/lib/session/session";
import { isUserOnboarded } from "./actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Safedep Platform",
};

export default async function Page() {
  const isOnboarded = await isUserOnboarded();
  if (isOnboarded) {
    return <AlreadyOnboardedDialog />;
  }
  const session = await sessionRequireAuth();

  return <OnboardClient user={session.user} />;
}
