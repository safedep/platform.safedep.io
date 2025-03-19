import React from "react";
import NavUser from "./nav-user";
import { auth0 } from "@/lib/auth0";

export default async function UserActions() {
  const user = (await auth0.getSession())?.user;
  if (!user) {
    return "";
  }

  return <NavUser user={user} />;
}
