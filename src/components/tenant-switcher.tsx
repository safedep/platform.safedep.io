"use client";

import * as React from "react";
import { Briefcase, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Access } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";

/**
 * Tenant object representing a team or organization
 */
export interface Tenant {
  id: string;
  name: string;
  tier: string;
}

/**
 * Props for the TenantSwitcher component
 */
export interface TenantSwitcherProps {
  className?: string;
  initialTenant: string;
  tenants: Access[];
  onTenantChange(tenant: string): Promise<void>;
}

/**
 * TenantSwitcher component
 *
 * A dropdown component that allows users to view and switch between different tenants.
 * Displays tenant name, tier, and provides options to add new tenants or switch tenants.
 * Adapts to screen size - full width on mobile, constrained width on larger screens.
 */
export default function TenantSwitcher({
  className,
  initialTenant,
  tenants,
  onTenantChange,
}: TenantSwitcherProps) {
  const [, startTransition] = React.useTransition();

  function handleTenantChange(tenant: string) {
    startTransition(async () => {
      if (onTenantChange) {
        await onTenantChange(tenant);
      }
    });
  }

  return (
    <Card className={cn("w-full p-0", className)}>
      <CardContent className="p-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto w-full justify-start p-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-black text-white">
                    <Briefcase className="size-5" />
                  </div>
                  <div className="grid text-left text-sm leading-tight">
                    <span className="font-semibold">{initialTenant}</span>
                  </div>
                </div>
                <ChevronsUpDown className="ml-2 size-4 opacity-50" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-full" align="start">
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Tenants
            </DropdownMenuLabel>
            {tenants.map(({ tenant }, index) => (
              <DropdownMenuItem
                key={tenant?.domain}
                onClick={() => handleTenantChange(tenant?.domain ?? "")}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-black text-white">
                  <Briefcase className="size-3.5 shrink-0" />
                </div>
                {tenant?.domain}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
