"use client";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@auth0/nextjs-auth0";

export default function UserMenu() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="hover:bg-muted flex items-center gap-2 rounded-md p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="sr-only">User menu</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="min-w-64 p-0" align="end">
        <div className="flex items-center gap-2 border-b p-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.picture} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-muted-foreground text-xs">{user?.email}</span>
          </div>
        </div>
        <div className="p-1.5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            size="sm"
            asChild
          >
            <a href="/auth/logout">
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
