"use client";
import { DataTable } from "@/components/policy/data-table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getPolicies } from "./actions";
import { columns } from "./columns";
import { toast } from "sonner";
import { useEffect } from "react";

export default function PolicyListClient() {
  const { data: policies, error } = useQuery({
    queryKey: ["policies"],
    queryFn: () => getPolicies(),
    initialData: [],
  });

  // show a toast if there is an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch policies");
    }
  }, [error]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Policies</h1>
        <Button asChild>
          <Link href="/v2/policy/new-policy">
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={policies} />
      </div>
    </div>
  );
}
