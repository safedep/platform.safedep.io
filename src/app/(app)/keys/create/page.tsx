import CreateKeyClient from "./client";
import { sessionRequireAuth } from "@/lib/session/session";

export default async function CreateKeyPage() {
  await sessionRequireAuth();

  return <CreateKeyClient />;
}
