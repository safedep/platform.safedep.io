"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ApiKey {
  id: string;
  name: string;
  description: string | null;
  expiresAt: string;
}

export interface ApiKeyListProps {
  className?: string;
  apiKeys: ApiKey[];
  onCreateKey?: () => void;
  onCopyKeyId?: (id: string) => void;
  onEditKey?: (key: ApiKey) => void;
  onRevokeKey?: (key: ApiKey) => void;
}

export default function ApiKeyList({
  className,
  apiKeys,
  onCreateKey,
  onCopyKeyId,
  onEditKey,
  onRevokeKey,
}: ApiKeyListProps) {
  function handleCreateKey() {
    if (onCreateKey) onCreateKey();
  }

  function handleCopyKeyId(id: string) {
    if (onCopyKeyId) {
      onCopyKeyId(id);
    } else {
      navigator.clipboard.writeText(id);
    }
  }

  function handleEditKey(key: ApiKey) {
    if (onEditKey) onEditKey(key);
  }

  function handleRevokeKey(key: ApiKey) {
    if (onRevokeKey) onRevokeKey(key);
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">
          <div className="flex items-center justify-between gap-2">
            <span>API Keys</span>
            <Button
              onClick={handleCreateKey}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Key</span>
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Manage your API keys here.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="text-right">Expires At</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center">
                      <p className="text-muted-foreground">
                        No API keys found. Create your first key to get started.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-mono text-sm">
                        {key.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="text-muted-foreground h-4 w-4" />
                          <span>{key.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {key.description || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {key.expiresAt}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleCopyKeyId(key.id)}
                            >
                              Copy Key ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditKey(key)}
                            >
                              Edit Key
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRevokeKey(key)}
                            >
                              Revoke Key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
