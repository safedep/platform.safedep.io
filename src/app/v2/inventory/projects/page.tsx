import PageHeader from "@/components/v2/page_header";
import getProjects from "./actions";
import ProjectsTable from "@/components/projects/ProjectTable";
import { SearchCode } from "lucide-react";

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
        {/* TODO: add pagination */}
        <ProjectsTable data={projects.projects} />
      </div>
    </div>
  );
}
