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

interface Policy {
  id: string;
  name: string;
  version: string;
  target: string;
  type: boolean;
  labels: string[];
  rulesCount: number;
}

interface AttachPolicyDialogProps {
  policies: Policy[];
  onAttach: (policyIds: string[]) => Promise<void>;
}

export function AttachPolicyDialog({
  policies,
  onAttach,
}: AttachPolicyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedPolicies, setSelectedPolicies] = useState<Set<string>>(
    new Set(),
  );
  const [isAttaching, setIsAttaching] = useState(false);

  // Memoize the filtered policies to prevent unnecessary recalculations
  const filteredPolicies = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return policies.filter((policy) => {
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
  }, [policies, searchQuery, typeFilter]);

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

  const toggleAll = useCallback(() => {
    setSelectedPolicies((prev) =>
      prev.size === filteredPolicies.length
        ? new Set()
        : new Set(filteredPolicies.map((p) => p.id)),
    );
  }, [filteredPolicies]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setSelectedPolicies(new Set());
    },
    [],
  );

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setSelectedPolicies(new Set());
  }, []);

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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setSelectedPolicies(new Set());
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Attach Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Available Policies</DialogTitle>
        </DialogHeader>

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

        <div className="rounded-md border">
          <div className="border-b px-3 py-2">
            <Checkbox
              checked={
                selectedPolicies.size === filteredPolicies.length &&
                filteredPolicies.length > 0
              }
              onCheckedChange={toggleAll}
              aria-label="Select all"
              className="mr-2"
            />
            <span className="text-sm text-muted-foreground">
              {selectedPolicies.size} selected
            </span>
          </div>
          <ScrollArea className="h-[300px]">
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
                {filteredPolicies.length - 100} more policies match your search.
                Try refining your search to see more relevant results.
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="mt-4">
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
        </DialogFooter>
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
    <div className="flex items-center border-b px-3 py-2 hover:bg-muted/50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        aria-label={`Select ${policy.name}`}
        className="mr-2"
      />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <div className="font-medium">{policy.name}</div>
          <div className="text-xs text-muted-foreground">
            {policy.version} • {policy.target}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={policy.type ? "default" : "destructive"}>
            {policy.type ? "Allow" : "Deny"}
          </Badge>
          <div className="flex gap-1">
            {policy.labels.map((label) => (
              <Badge key={label} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
