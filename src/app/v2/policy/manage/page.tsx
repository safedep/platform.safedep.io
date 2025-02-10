import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
          <p className="text-muted-foreground">Manage your policy groups.</p>
        </div>
        <Button asChild>
          <Link href="/policies/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Policy
          </Link>
        </Button>
      </div>
      {/* <PolicyList /> */}
    </div>
  );
}
