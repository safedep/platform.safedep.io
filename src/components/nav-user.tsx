"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "./LogoutLink";
import { User } from "@auth0/nextjs-auth0/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function UserInfoCard({ user, apiKeys }: { user: User; apiKeys: any }) {
  return (
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
          <div className="flex justify-between gap-2 text-end">
            <strong>Tenant:</strong>
            <span className="overflow-auto">{apiKeys?.tenant}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NavUser({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer rounded-lg border border-1 gap-2 p-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LogOut />
            <LogoutLink>Log out</LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
