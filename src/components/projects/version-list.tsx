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
import { useEffect, useMemo, useState } from "react";
import type { ProjectVersionWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";

export interface VersionListProps {
  versions: ProjectVersionWithAttributes[];
  onSelect: (version?: ProjectVersionWithAttributes) => void;
}

export default function VersionList({ versions, onSelect }: VersionListProps) {
  // this becomes the part of our props
  const [value, setValue] = useState(versions.at(0)?.version?.version); // this is the version name not the label
  const [open, setOpen] = useState(false);

  const selectedVersion = useMemo(() => {
    const val = versions.find(({ version }) => version?.version === value);
    return val;
  }, [value, versions]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: to select default value once the component is mounted
  useEffect(() => {
    onSelect(selectedVersion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="slider"
          className="w-[250px] justify-between"
        >
          <span className="flex gap-2 items-center">
            <GitBranch className="opacity-50" />
            {value ? selectedVersion?.version?.version : "Select version..."}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command onValueChange={(x) => setValue(x)}>
          <CommandInput placeholder="Search version..." className="h-9" />
          <CommandList>
            <CommandEmpty>No version found.</CommandEmpty>
            <CommandGroup>
              {versions?.map(({ version }) => (
                <CommandItem
                  key={version?.projectVersionId}
                  value={version?.version}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    onSelect(
                      versions.find(
                        ({ version }) => version?.version === currentValue,
                      ),
                    );
                    setOpen(false);
                  }}
                >
                  {version?.version}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === version?.version ? "opacity-100" : "opacity-0",
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
