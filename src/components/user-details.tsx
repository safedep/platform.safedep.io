"use client";

import { GalleryVerticalEnd } from "lucide-react";
import * as React from "react";
import { UserInfoCard } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { useUser } from "@auth0/nextjs-auth0";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Default Team",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
  ],
};

export function AppHeader({}: {}) {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4 justify-end w-[90%]">
      <TeamSwitcher teams={data.teams} />
      {user ? <UserInfoCard user={user} /> : ""}
    </div>
  );
}
