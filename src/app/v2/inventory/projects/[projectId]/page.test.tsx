import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";
import { act } from "react";
import {
  ListProjectVersionsResponse,
  ProjectVersionWithAttributes,
} from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import { ProjectVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/project_pb";

vi.mock("server-only", () => {
  return {};
});

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ projectId: "ABC123" })),
}));

vi.mock("./actions", () => ({
  async listProjectVersions() {
    return [
      new ListProjectVersionsResponse({
        projectVersions: [
          new ProjectVersionWithAttributes({
            version: new ProjectVersion({
              projectId: "ABC",
              projectVersionId: "ABC-version",
              version: "1.0.0",
            }),
          }),
          new ProjectVersionWithAttributes({
            version: new ProjectVersion({
              projectId: "DEF",
              projectVersionId: "DEF-version",
              version: "1.1.0",
            }),
          }),
        ],
      }),
    ];
  },
  async listProjectVersionBOM() {
    return [];
  },
  async listBOMComponents() {
    return [];
  },
}));

describe("Project page", () => {
  it("can be mounted", async () => {
    await act(async () => {
      render(<Page />);
    });
  });

  it("displays project title", async () => {
    await act(async () => {
      return render(<Page />);
    });
    expect(screen.getByRole("heading")).toHaveTextContent(
      /ABC123 Project Details/,
    );
  });
});
