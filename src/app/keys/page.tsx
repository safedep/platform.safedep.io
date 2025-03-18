import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getApiKeys } from "./actions";
import { DataTable } from "../../components/data-table";
import { columns } from "./columns";
import { AppHeader } from "@/components/user-details";

export default async function Page() {
  const { apiKeys } = await getApiKeys();

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center mt-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
          Manage Keys
        </h1>
        <p className="text-base text-gray-600 mt-2">
          You can create, view, and delete API keys here.
        </p>
      </div>

      <div className="flex w-[90%] p-0 sm:p-7 lg:flex-row flex-col m-auto sm:items-center">
        <div className="flex items-center">
          <AppHeader />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-0 sm:p-4 pt-0">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 ml-auto">
              <Button asChild>
                <Link href="/keys/create">Create API Key</Link>
              </Button>
            </div>
          </header>
          <DataTable columns={columns} data={apiKeys} />
        </div>
      </div>
    </div>
  );
}
