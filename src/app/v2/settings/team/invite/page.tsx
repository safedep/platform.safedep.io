"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { serverCreateTeamInvite } from "./actions";
import AccessRoleHelp from "./help";

export default function Page() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");

  const router = useRouter();

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      serverCreateTeamInvite({ name, email, role })
        .then(() => {
          toast({
            title: "User invited",
            description: "User has been invited to the team",
          });

          router.push("/v2/settings/team/pending");
        })
        .catch((err) => {
          toast({
            title: "Error inviting user",
            description: err.message,
            variant: "destructive",
          });
        });
    },
    [name, email, role, router],
  );

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <form onSubmit={handleSubmit}>
            <Card className="flex flex-col gap-4 p-4">
              <CardHeader>
                <CardTitle>Invite User</CardTitle>
                <CardDescription>
                  Invite a user to your team by entering their email address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Name of the user to invite"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Email</Label>
                    <Input
                      id="description"
                      placeholder="Email address of the user to invite"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      onValueChange={(value) => setRole(value)}
                      defaultValue="30"
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="readonly">Read-only</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/v2/settings/team")}
                >
                  Cancel
                </Button>
                <Button type={"submit"}>Invite</Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        <div className="col-span-1">
          <AccessRoleHelp />
        </div>
      </div>
    </div>
  );
}
