import OnboardClient from "./client";
import AlreadyOnboardedDialog from "@/components/onboarding/already-onboarded-dialog";
import { sessionRequireAuth } from "@/lib/session/session";
import { isUserOnboarded } from "./actions";
import { Metadata, Route } from "next";
import * as v from "valibot";
import { getSafeRedirect } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Onboarding",
};

const searchParamsSchema = v.object({
  returnTo: v.optional(v.pipe(v.string(), v.nonEmpty())),
});
type SearchParams = v.InferInput<typeof searchParamsSchema>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { success, output } = v.safeParse(
    searchParamsSchema,
    await searchParams,
  );
  let returnTo = undefined;
  if (success) {
    returnTo = getSafeRedirect(output?.returnTo, "/");
  }

  const isOnboarded = await isUserOnboarded();
  if (isOnboarded) {
    return <AlreadyOnboardedDialog />;
  }
  const session = await sessionRequireAuth();

  return <OnboardClient user={session.user} returnTo={returnTo as Route} />;
}
