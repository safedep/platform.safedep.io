import CreateKeyClient from "./client";
import { sessionRequireAuth } from "@/lib/session/session";

export const metadata = {
  title: "Create API Key | Safedep",
  description: "Create a new API key",
};

export default async function CreateKeyPage() {
  await sessionRequireAuth();

  return <CreateKeyClient />;
}
