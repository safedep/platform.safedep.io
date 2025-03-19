"use client";
import { CopyIcon, GalleryVerticalEnd } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamSwitcher } from "@/components/team-switcher";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApiKeys } from "@/app/(app)/keys/actions";
import { User } from "@auth0/nextjs-auth0/types";
import { toast } from "sonner";

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

export default function UserDetails({
  user,
  apiKeys,
}: {
  user: User;
  apiKeys: ApiKeys;
}) {
  const tenant = apiKeys?.tenant;

  return (
    <div className="flex flex-col gap-4 justify-end w-[90%]">
      <TeamSwitcher teams={data.teams} />
      {user ? (
        <Card className="w-full max-w-md border border-gray-300 rounded-xl shadow-lg">
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
              <div className="flex justify-between gap-2 text-end">
                <strong>Tenant:</strong>
                <div className="flex items-center gap-2">
                  <span className="overflow-auto">{tenant}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CopyIcon
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(tenant);
                            toast.success(
                              "The Tenant ID has been copied to your clipboard",
                            );
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Copy tenant ID</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        ""
      )}
    </div>
  );
}
