import { auth0 } from "@/lib/auth0";
import OnboardClient from "./client";
import { redirect } from "next/navigation";
import "server-only";

export default async function Page() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return redirect("/auth");
  }

  return <OnboardClient user={session?.user} />;
}
