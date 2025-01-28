import PageHeader from "@/components/v2/page_header";
import getProjects from "./actions";
import { SearchCode } from "lucide-react";
import { DataTable } from "@/components/projects/data-table";
import { columns } from "@/app/v2/inventory/projects/columns";
import { Project_Source } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/project_pb";

export default async function Page() {
  const projects = await getProjects();

  return (
    <div className="container p-4">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 scroll-m-20 border-b">
        <div className="flex items-center gap-2">
          <PageHeader title="Projects" icon={SearchCode} />
        </div>
      </header>
      <div className="pt-4">
        <DataTable
          columns={columns}
          data={projects.projects.map(({ project, attributes }) => ({
            source: project?.source ?? Project_Source.UNSPECIFIED,
            name: project?.name ?? "",
            id: project?.projectId ?? "",
            createdAt: project?.createdAt?.toDate() ?? new Date(),
            version: attributes?.versions,
          }))}
        />
      </div>
    </div>
  );
}
