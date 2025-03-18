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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { createApiKey } from "./actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Page() {
  const [keyValue, setKeyValue] = React.useState("");
  const [name, setName] = React.useState("");
  const [tenant, setTenant] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [expiryDays, setExpiryDays] = React.useState("30");

  const router = useRouter();

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Call server action to create API key
      createApiKey({
        name: name,
        description: description,
        expiryDays: parseInt(expiryDays, 10),
      })
        .then((data) => {
          setKeyValue(data.key);
          setTenant(data.tenant);
        })
        .catch((err) => {
          toast({
            title: "Error creating API key",
            description: err.message,
            variant: "destructive",
          });
        });
    },
    [name, description, expiryDays],
  );

  const handleCopyKey = React.useCallback(() => {
    navigator.clipboard.writeText(keyValue);
  }, [keyValue]);

  const handleCopyTenant = React.useCallback(() => {
    navigator.clipboard.writeText(tenant);
  }, [tenant]);

  // Show the key with a button to go back
  if (keyValue) {
    return (
      <div className="container mx-auto">
        <Card className="flex flex-col gap-4 p-4">
          <CardHeader>
            <CardTitle>API Key Created</CardTitle>
            <CardDescription>
              Your API key has been created successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="key"> Current Tenant</Label>
              <div className="flex items-center gap-2">
                <code className="relative rounded bg-muted px-[0.8rem] py-[0.8rem] font-mono text-sm font-semibold min-w-[30rem]">
                  {tenant}
                </code>
                <Button onClick={handleCopyTenant}>Copy</Button>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5 mt-8">
              <Label htmlFor="key">API Key</Label>
              <div className="flex items-center gap-2">
                <code className="relative rounded bg-muted px-[0.8rem] py-[0.8rem] font-mono text-sm font-semibold min-w-[30rem]">
                  {keyValue}
                </code>
                <Button onClick={handleCopyKey}>Copy</Button>
              </div>
              <div className="text-sm text-accent-foreground">
                Copy this key now. It will not be shown again.
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button">
              <Link href={"/keys"}>Back</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render the form to create API key
  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        <Card className="flex flex-col gap-4 p-4">
          <CardHeader>
            <CardTitle>Create API Key</CardTitle>
            <CardDescription>
              Create an API key for use with tools or direct API access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Key name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Key description"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Expiry</Label>
                <Select
                  onValueChange={(value) => setExpiryDays(value)}
                  defaultValue="30"
                >
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/keys")}
            >
              Cancel
            </Button>
            <Button type={"submit"}>Create</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
