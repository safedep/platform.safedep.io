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
import Link from "next/link";

export default function UserMenu() {
  const { user } = useUser();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="hover:bg-muted flex items-center gap-2 rounded-md p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.picture} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="sr-only">User menu</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" align="end">
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
            <Link href="/auth/logout">
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
