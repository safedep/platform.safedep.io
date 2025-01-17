import { Button } from "@/components/ui/button";
import PageHeader from "@/components/v2/page_header";
import Link from "next/link";
import { serverListTeamAccess } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function ListTeamMembersPage() {
  const data = await serverListTeamAccess();

  return (
    <div className="container mx-auto">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex pl-3 items-center gap-2">
          <PageHeader title="Team Members" />
        </div>
        <div className="flex items-center gap-2 px-4 ml-auto">
          <Link href="/v2/settings/team/invite">
            <Button>Invite</Button>
          </Link>
          <Link href="/v2/settings/team/pending">
            <Button variant="outline">Pending Invitations</Button>
          </Link>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
