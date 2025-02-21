import { Button } from "@/components/ui/button";
import Link from "next/link";
import { serverExecuteGetApiKeys } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { timestampDate } from "@bufbuild/protobuf/wkt";

async function Page() {
  const apiKeys = await serverExecuteGetApiKeys();
  const data = apiKeys.keys.map((key) => ({
    id: key.keyId,
    name: key.name,
    description: key.description,
    expiresAt: key.expiresAt ? timestampDate(key.expiresAt) : new Date(),
  }));

  return (
    <div className="container mx-auto">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 ml-auto">
          <Button>
            <Link href="/v2/settings/keys/create">Create API Key</Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Page;
