"use client";

import * as React from "react";
import { Briefcase, ChevronsUpDown, Plus, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  /** Optional className for styling */
  className?: string;
  /** Initial active tenant (optional) */
  initialTenant?: Tenant;
  /** List of available tenants */
  tenants?: Tenant[];
  /** Callback when tenant changes */
  onTenantChange?: (tenant: Tenant) => void;
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
  tenants: propsTenants,
  onTenantChange,
}: TenantSwitcherProps) {
  // Default tenants if none provided
  const defaultTenants = [
    { id: "1", name: "Default Team", tier: "Free" },
    { id: "2", name: "Engineering Team", tier: "Pro" },
    { id: "3", name: "Security Team", tier: "Enterprise" },
  ];

  const tenants = propsTenants || defaultTenants;
  const [activeTenant, setActiveTenant] = React.useState<Tenant>(
    initialTenant || tenants[0],
  );

  // Handle tenant change
  const handleTenantChange = (tenant: Tenant) => {
    setActiveTenant(tenant);
    if (onTenantChange) {
      onTenantChange(tenant);
    }
  };

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
                    <span className="font-semibold">{activeTenant.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {activeTenant.tier}
                    </span>
                  </div>
                </div>
                <ChevronsUpDown className="ml-2 size-4 opacity-50" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
            align="start"
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {tenants.map((tenant, index) => (
              <DropdownMenuItem
                key={tenant.id}
                onClick={() => handleTenantChange(tenant)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-black text-white">
                  <Briefcase className="size-3.5 shrink-0" />
                </div>
                {tenant.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <ArrowRight className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Switch Tenant
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
