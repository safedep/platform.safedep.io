import { Box } from "lucide-react";
import {
  SiGithub,
  SiGitlab,
  SiBitbucket,
} from "@icons-pack/react-simple-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useCallback } from "react";
import type { ProjectWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import { Project_Source } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/project_pb";

export interface ProjectTableProps {
  data: ProjectWithAttributes[];
}

export default function ProjectsTable({ data }: ProjectTableProps) {
  //   const { data, isLoading, filters, setFilters, fetchProjects } = useProjects();
  //   const [debouncedFetch] = useDebounce(fetchProjects, 300);

  //   const handleSearchChange = useCallback(
  //     (value: string) => {
  //       setFilters((prev) => ({ ...prev, search: value }));
  //       debouncedFetch();
  //     },
  //     [setFilters, debouncedFetch],
  //   );

  //   const handleSourceChange = useCallback(
  //     (value: string) => {
  //       setFilters((prev) => ({
  //         ...prev,
  //         source: value as "github" | "gitlab" | "bitbucket" | "other",
  //       }));
  //       fetchProjects();
  //     },
  //     [setFilters, fetchProjects],
  //   );
  const getSourceIcon = useCallback((source: Project_Source) => {
    switch (source) {
      case Project_Source.GITHUB:
        return <SiGithub className="h-4 w-4" />;
      case Project_Source.GITLAB:
        return <SiGitlab className="h-4 w-4" />;
      case Project_Source.BITBUCKET:
        return <SiBitbucket className="h-4 w-4" />;
      default:
        return <Box className="h-4 w-4" />;
    }
  }, []);

  const getSourceName = useCallback((source: Project_Source) => {
    switch (source) {
      case Project_Source.GITHUB:
        return "GitHub";
      case Project_Source.GITLAB:
        return "GitLab";
      case Project_Source.BITBUCKET:
        return "Bitbucket";
      default:
        return "Other";
    }
  }, []);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <div className="p-4 space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead className="w-[30%]">Source</TableHead>
                <TableHead className="w-[30%]">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                data.map(({ project }) => (
                  <TableRow key={project?.projectId}>
                    <TableCell className="font-medium">
                      {project?.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSourceIcon(
                          project?.source ?? Project_Source.UNSPECIFIED,
                        )}
                        <span className="capitalize">
                          {getSourceName(
                            project?.source ?? Project_Source.UNSPECIFIED,
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {project?.createdAt?.toDate().toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
