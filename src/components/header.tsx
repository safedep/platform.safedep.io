"use client";

import React from "react";
import { NavUser } from "./nav-user";
import { useUser } from "@auth0/nextjs-auth0";

const UserActions: React.FC = () => {
  const { user } = useUser();

  return <>{user ? <NavUser user={user} /> : ""}</>;
};

export default UserActions;
