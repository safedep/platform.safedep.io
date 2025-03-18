"use client";

import React from "react";
import { useUser } from "@auth0/nextjs-auth0";
import NavUser from "./nav-user";

const UserActions: React.FC = () => {
  const { user } = useUser();

  return <>{user ? <NavUser user={user} /> : ""}</>;
};

export default UserActions;
