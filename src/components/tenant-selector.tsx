"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserIcon } from "lucide-react";
import { Access } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";
import { useTransition } from "react";

interface TenantSelectorProps {
  userEmail: string;
  tenants: Access[];
  onSelectTenant(tenant: string): Promise<void>;
  cardTitle?: string;
  cardDescription?: string;
}

export default function TenantSelector({
  userEmail,
  tenants,
  onSelectTenant,
  cardTitle,
  cardDescription,
}: TenantSelectorProps) {
  const [, startTransition] = useTransition();

  async function handleSelectTenant(tenant: string) {
    startTransition(async () => {
      await onSelectTenant(tenant);
    });
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <div className="text-muted-foreground mb-3 flex items-center justify-center gap-1.5 text-sm">
        <UserIcon className="h-3.5 w-3.5" />
        <span>Welcome {userEmail}</span>
      </div>
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>{cardTitle ?? "Select tenant"}</CardTitle>
          <CardDescription>
            {cardDescription ?? "Select the tenant to use with the application"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select onValueChange={handleSelectTenant}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem
                  key={tenant.tenant?.domain}
                  value={tenant.tenant?.domain ?? ""}
                >
                  {tenant.tenant?.domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <a href="/auth/logout">Logout</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
