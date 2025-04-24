"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UserData {
  name: string;
  email: string;
  tenant: string;
  avatar: string;
}

interface UserInfoProps {
  className?: string;
  userData: UserData;
}

export default function UserInfo({ className, userData }: UserInfoProps) {
  const user = userData;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Tenant ID copied to clipboard");
  }

  return (
    <Card className={cn("lg:min-w-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>User Information</span>
          <Avatar className="border-ring size-12 border">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="space-y-4 text-sm">
            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground font-medium">Name</span>
              <span className="font-medium">{user.name}</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground font-medium">Email</span>
              <span className="font-medium break-all">{user.email}</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground font-medium">Tenant</span>
              <div className="bg-muted/50 flex items-center justify-between rounded-md p-2.5 pr-1.5">
                <code className="text-foreground/80 font-mono text-xs font-medium break-all">
                  {user.tenant}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-background h-7 w-7 rounded-full"
                  onClick={() => copyToClipboard(user.tenant)}
                  title="Copy tenant ID"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy tenant ID</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
