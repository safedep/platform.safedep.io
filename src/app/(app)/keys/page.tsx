import { sessionRequireAuth } from "@/lib/session/session";
import KeysClient from "./client";

export default async function KeysPage() {
  await sessionRequireAuth();

  return <KeysClient />;
}
