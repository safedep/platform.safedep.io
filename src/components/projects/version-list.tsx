"use client";

import { Check, ChevronsUpDown, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo, useState } from "react";

export default function VersionList() {
  // this becomes the part of our props
  const [value, setValue] = useState("");
  const frameworks = useMemo(() => {
    const frameworks = Array.from({ length: 100 }).map((_, index) => ({
      value: `v${index}`,
      label: `Version ${index}`,
    }));
    return frameworks;
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="slider"
          //   aria-expanded={open}
          className="w-[250px] justify-between"
        >
          <span className="flex gap-2 items-center">
            <GitBranch className="opacity-50" />
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select version..."}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search version..." className="h-9" />
          <CommandList>
            <CommandEmpty>No version found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
