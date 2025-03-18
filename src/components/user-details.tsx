"use client";

import { CopyIcon, GalleryVerticalEnd } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamSwitcher } from "@/components/team-switcher";
import { useUser } from "@auth0/nextjs-auth0";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { serverExecuteGetApiKeys } from "@/app/v2/settings/keys/actions";
import { useQuery } from "@tanstack/react-query";

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

export function AppHeader() {
  const { user } = useUser();
  const { data: keysData, isLoading } = useQuery({
    queryKey: ["tenant"],
    queryFn: serverExecuteGetApiKeys,
    refetchOnWindowFocus: false,
    retry: 1, // only retry once on failure
  });
  const tenant = keysData?.tenant;

  return (
    <div className="flex flex-col gap-4 justify-end w-[90%]">
      <TeamSwitcher teams={data.teams} />
      {user ? (
        <Card className="w-full max-w-md border border-gray-300 rounded-xl shadow-lg shadow-blue-600/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>User Information</div>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full flex-col gap-1">
              <div className="flex justify-between gap-2 text-end ">
                <strong>Name:</strong>
                <span className="overflow-auto">{user.name}</span>
              </div>
              <div className="flex justify-between gap-2 text-end">
                <strong>Email:</strong>
                <span className="overflow-auto">{user.email}</span>
              </div>
              {isLoading && <div>Loading...</div>}
              {!isLoading && (
                <div className="flex justify-between gap-2 text-end">
                  <strong>Tenant:</strong>
                  <div className="flex items-center gap-2 items-center">
                    <span className="overflow-auto">{tenant}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CopyIcon
                          className="cursor-pointer"
                          onClick={() =>
                            navigator.clipboard.writeText(tenant || "")
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>Copy tenant ID</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        ""
      )}
    </div>
  );
}
