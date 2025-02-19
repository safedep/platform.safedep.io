"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Plus, Search, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Policy } from "@/app/v2/policy/list/actions";
import { PolicyType } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";

interface AttachPolicyDialogProps {
  policies: Policy[];
  attachedPolicyIds: string[];
  onAttach(policyIds: string[]): Promise<void>;
}

export function AttachPolicyDialog({
  policies,
  attachedPolicyIds,
  onAttach,
}: AttachPolicyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "allow" | "deny">("all");
  const [selectedPolicies, setSelectedPolicies] = useState<Set<string>>(
    new Set(),
  );
  const [isAttaching, setIsAttaching] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // First filter out attached policies, then apply search and type filters
  const filteredPolicies = useMemo(() => {
    const unattachedPolicies = policies.filter(
      (policy) => !attachedPolicyIds.includes(policy.id),
    );

    const searchLower = searchQuery.toLowerCase();
    return unattachedPolicies.filter((policy) => {
      const matchesSearch =
        policy.name.toLowerCase().includes(searchLower) ||
        policy.labels.some((label) =>
          label.toLowerCase().includes(searchLower),
        );

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "allow" && policy.type) ||
        (typeFilter === "deny" && !policy.type);

      return matchesSearch && matchesType;
    });
  }, [policies, attachedPolicyIds, searchQuery, typeFilter]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const handleTypeFilterChange = useCallback(
    (value: "all" | "allow" | "deny") => {
      setTypeFilter(value);
    },
    [],
  );

  const togglePolicy = useCallback((policyId: string) => {
    setSelectedPolicies((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(policyId)) {
        newSelected.delete(policyId);
      } else {
        newSelected.add(policyId);
      }
      return newSelected;
    });
  }, []);

  // Update toggleAll to only affect visible policies
  const toggleAll = useCallback(() => {
    setSelectedPolicies((prev) => {
      const visibleSelected = filteredPolicies.every((policy) =>
        prev.has(policy.id),
      );

      if (visibleSelected) {
        // Unselect only the visible ones
        const newSelected = new Set(prev);
        filteredPolicies.forEach((policy) => {
          newSelected.delete(policy.id);
        });
        return newSelected;
      } else {
        // Select all visible ones while keeping previous selections
        const newSelected = new Set(prev);
        filteredPolicies.forEach((policy) => {
          newSelected.add(policy.id);
        });
        return newSelected;
      }
    });
  }, [filteredPolicies]);

  const handleAttach = async () => {
    try {
      setIsAttaching(true);
      await onAttach(Array.from(selectedPolicies));
      setIsOpen(false);
      setSelectedPolicies(new Set());
    } catch (error) {
      console.error("Failed to attach policies:", error);
    } finally {
      setIsAttaching(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedPolicies(new Set());
      setSearchQuery("");
      setTypeFilter("all");
    }
  };

  const triggerButton = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Attach Policy
    </Button>
  );

  const searchAndFilterSection = (
    <div className="flex items-center space-x-4 py-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Filter type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="allow">Allow</SelectItem>
          <SelectItem value="deny">Deny</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const policyList = (
    <div className="rounded-md border">
      <div className="border-b px-3 py-2">
        <Checkbox
          checked={
            filteredPolicies.length > 0 &&
            filteredPolicies.every((policy) => selectedPolicies.has(policy.id))
          }
          onCheckedChange={toggleAll}
          aria-label="Select all visible policies"
          className="mr-2"
        />
        <span className="text-sm text-muted-foreground">
          {selectedPolicies.size} selected
          {filteredPolicies.length < policies.length && (
            <span className="ml-1">({filteredPolicies.length} visible)</span>
          )}
        </span>
      </div>
      <ScrollArea className={isMobile ? "h-[50vh]" : "h-[300px]"}>
        {filteredPolicies.slice(0, 100).map((policy) => (
          <PolicyListItem
            key={policy.id}
            policy={policy}
            isSelected={selectedPolicies.has(policy.id)}
            onToggle={() => togglePolicy(policy.id)}
          />
        ))}
        {filteredPolicies.length > 100 && (
          <div className="p-3 text-center text-sm text-muted-foreground">
            {filteredPolicies.length - 100} more policies match your search. Try
            refining your search to see more relevant results.
          </div>
        )}
      </ScrollArea>
    </div>
  );

  const footerContent = (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {filteredPolicies.length} policies found
      </span>
      <Button
        onClick={handleAttach}
        disabled={selectedPolicies.size === 0 || isAttaching}
      >
        {isAttaching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Attach Selected ({selectedPolicies.size})
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Available Policies</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">
            {searchAndFilterSection}
            {policyList}
          </div>
          <DrawerFooter className="mt-4">{footerContent}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Available Policies</DialogTitle>
        </DialogHeader>
        {searchAndFilterSection}
        {policyList}
        <DialogFooter className="mt-4">{footerContent}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PolicyListItemProps {
  policy: Policy;
  isSelected: boolean;
  onToggle: () => void;
}

function PolicyListItem({ policy, isSelected, onToggle }: PolicyListItemProps) {
  return (
    <div className="flex border-b px-3 py-2 hover:bg-muted/50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        aria-label={`Select ${policy.name}`}
        className="mr-2 mt-1.5"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="truncate font-medium">{policy.name}</div>
            <div className="text-xs text-muted-foreground">
              {policy.version} • {policy.target}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                policy.type === PolicyType.ALLOW ? "default" : "destructive"
              }
            >
              {policy.type === PolicyType.ALLOW ? "Allow" : "Deny"}
            </Badge>
            <ScrollArea className="w-full max-w-[200px] sm:w-auto">
              <div className="flex gap-1">
                {policy.labels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="whitespace-nowrap"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
