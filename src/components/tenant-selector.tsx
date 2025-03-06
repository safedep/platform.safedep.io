"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserInfo {
  access: { tenant?: { domain: string } }[];
}

interface TenantSelectorProps {
  userInfo: UserInfo;
  handleSetTenant: (tenant: string) => void;
  handleLogout: () => void;
}

export default function TenantSelector({
  userInfo,
  handleSetTenant,
  handleLogout,
}: TenantSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Select Tenant</CardTitle>
        <CardDescription>
          Select the tenant for use with the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="tenant">Tenant</Label>
            <Select
              name="tenant"
              onValueChange={async (tenant) => {
                setIsLoading(true);
                try {
                  await handleSetTenant(tenant);
                } finally {
                  setIsLoading(false);
                }
                await handleSetTenant(tenant); // Call the server function
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tenant to continue ..." />
              </SelectTrigger>
              <SelectContent position="popper">
                {userInfo?.access.map((access) => (
                  <SelectItem
                    key={access?.tenant?.domain}
                    value={access?.tenant?.domain ?? ""}
                  >
                    {access.tenant?.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}
