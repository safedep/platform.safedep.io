import { redirect } from "next/navigation";

export default async function Page() {
  redirect("/platform/keys/list");
}
