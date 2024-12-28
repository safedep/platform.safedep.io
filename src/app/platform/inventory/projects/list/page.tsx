"use client";
import { useEffect, useState } from "react";
import type { Project } from "../types/project";
import { EyeIcon, FolderIcon } from "lucide-react";
import { ApiKeyNavigations } from "./navigations";
import Sidebar from "@/app/platform/components/sidebar";

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/inventory/projects/list");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-8">
      <Sidebar items={ApiKeyNavigations} />

      <div className="flex-1">
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center space-x-2">
              <FolderIcon className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Components
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Violations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project, index) => (
                  <tr
                    key={`${project.name}-${index}`}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {project.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {project.version}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">
                          {project.components}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <svg
                          className={`h-5 w-5 ${
                            project.violations > 100
                              ? "text-red-500"
                              : project.violations > 30
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span
                          className={`font-medium ${
                            project.violations > 100
                              ? "text-red-600"
                              : project.violations > 30
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {project.violations}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1 rounded-full hover:bg-blue-50"
                        aria-label="View project details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
