"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Project_Source } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/project_pb";
import {
  SiBitbucket,
  SiGithub,
  SiGitlab,
} from "@icons-pack/react-simple-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { Box, MoreHorizontal, ScrollText } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  source: Project_Source;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      // return a truncated and stylized version of the ID
      return (
        <div className="text-muted-foreground font-mono">
          {row.original.id.slice(0, 8)}...
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <div>{sourceToIcon(row.original.source)}</div>
          <div>{sourceToName(row.original.source)}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const key = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(key.id);
                toast({
                  description: "Project ID copied to clipboard",
                });
              }}
            >
              Copy Key ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function sourceToIcon(source: Project_Source) {
  switch (source) {
    case Project_Source.GITHUB:
      return <SiGithub className="h-4 w-4" />;
    case Project_Source.GITLAB:
      return <SiGitlab className="h-4 w-4" />;
    case Project_Source.BITBUCKET:
      return <SiBitbucket className="h-4 w-4" />;
    case Project_Source.OTHER:
      return <Box className="h-4 w-4" />;
    default:
      return <ScrollText className="h-4 w-4" />;
  }
}

function sourceToName(source: Project_Source) {
  switch (source) {
    case Project_Source.GITHUB:
      return "GitHub";
    case Project_Source.GITLAB:
      return "GitLab";
    case Project_Source.BITBUCKET:
      return "Bitbucket";
    case Project_Source.OTHER:
      return "Other";
    default:
      return "Unknown";
  }
}
