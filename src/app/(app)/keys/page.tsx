import { sessionGetTenant, sessionRequireAuth } from "@/lib/session/session";
import KeysClient from "./client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Keys",
  description: "Manage your API keys",
};

export default async function KeysPage() {
  await sessionRequireAuth();

  const tenant = await sessionGetTenant();
  if (!tenant) {
    return redirect("/");
  }

  return <KeysClient initialTenant={tenant} />;
}
