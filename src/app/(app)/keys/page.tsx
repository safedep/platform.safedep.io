import { sessionGetTenant, sessionRequireAuth } from "@/lib/session/session";
import KeysClient from "./client";
import { redirect } from "next/navigation";

export default async function KeysPage() {
  await sessionRequireAuth();

  const tenant = await sessionGetTenant();
  if (!tenant) {
    return redirect("/");
  }

  return <KeysClient initialTenant={tenant} />;
}
