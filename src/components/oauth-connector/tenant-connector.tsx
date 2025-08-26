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
import { Access } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";
import { useState, useTransition } from "react";

interface TenantConnectorProps {
  userEmail: string;
  tenants: Access[];
  onSelectTenant(tenant: string): Promise<void>;
  cardTitle?: string;
  cardDescription?: string;
}

export default function TenantConnector({
  tenants,
  onSelectTenant,
  cardTitle,
  cardDescription,
}: TenantConnectorProps) {
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleSetTenant(tenant: string) {
    setSelectedTenant(tenant);
  }

  function handleConnect() {
    if (!selectedTenant) {
      return;
    }
    startTransition(async () => {
      await onSelectTenant(selectedTenant);
    });
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>{cardTitle ?? "Select tenant"}</CardTitle>
          <CardDescription>
            {cardDescription ?? "Select the tenant to use with this connection"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select onValueChange={handleSetTenant} value={selectedTenant}>
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

          <div className="flex w-full">
            <Button
              className="w-full md:w-auto"
              onClick={handleConnect}
              disabled={!selectedTenant || isPending}
              size="lg"
            >
              {isPending ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
