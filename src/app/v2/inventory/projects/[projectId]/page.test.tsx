import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";
import { act } from "react";
import {
  ListProjectVersionsResponseSchema,
  ListProjectVersionBOMResponseSchema,
  ListBOMComponentsResponseSchema,
} from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import { BOM_Status } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/bom_pb";
import { Classification } from "@buf/safedep_api.bufbuild_es/safedep/messages/bom/v1/cdx_pb";
import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { create, toJson } from "@bufbuild/protobuf";

vi.mock("server-only", () => {
  return {};
});

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ projectId: "ABC123" })),
}));

vi.mock("./actions", () => ({
  async listProjectVersions() {
    const r = create(ListProjectVersionsResponseSchema, {
      projectVersions: [
        {
          version: {
            version: "1.0.0",
            projectId: "PROJ-1",
            projectVersionId: "PROJ-1-ID1",
          },
        },
        {
          version: {
            version: "2.0.0",
            projectId: "PROJ-1",
            projectVersionId: "PROJ-1-ID2",
          },
        },
      ],
    });
    return toJson(ListProjectVersionsResponseSchema, r);
  },
  async listProjectVersionBOM() {
    // this response represents the latest version's BOM
    const r = create(ListProjectVersionBOMResponseSchema, {
      boms: [
        {
          bom: { bomId: "BOM-1", status: BOM_Status.LATEST },
        },
        { bom: { bomId: "BOM-2", status: BOM_Status.UNSPECIFIED } },
        { bom: { bomId: "BOM-3", status: BOM_Status.HISTORICAL } },
      ],
    });
    return toJson(ListProjectVersionBOMResponseSchema, r);
  },
  async listBOMComponents() {
    const r = create(ListBOMComponentsResponseSchema, {
      components: [
        {
          component: {
            componentId: "COMP-1",
            name: "Component 1",
            version: "1.0.0",
            classification: Classification.LIBRARY,
          },
        },
        {
          component: {
            componentId: "COMP-2",
            name: "Component 2",
            version: "2.0.0",
            classification: Classification.CONTAINER,
            ecosystem: Ecosystem.CARGO,
          },
        },
      ],
    });
    return toJson(ListBOMComponentsResponseSchema, r);
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

  describe("BOMs tab", () => {
    it("has BOM table", async () => {
      const user = userEvent.setup();
      await act(async () => {
        return render(<Page />);
      });

      // go to boms tab
      await user.click(screen.getByRole("tab", { name: "BOMs" }));

      // Get the table element
      const table = screen.getByRole("table");

      // Get all rows within the table
      const rows = within(table).getAllByRole("row");

      // get the first row (header)
      const headerRow = rows[0];

      // get the header cells
      const headerCells = within(headerRow).getAllByRole("columnheader");

      // Extract text from the header cells
      const headerTexts = headerCells.map((cell) => cell.textContent);

      // Assert the header cells match exactly
      expect(headerTexts).toEqual([
        "BOM ID",
        "Created At",
        "Status",
        "Last Updated",
      ]);
    });

    it("table has BOM IDs", async () => {
      const user = userEvent.setup();
      await act(async () => {
        return render(<Page />);
      });

      // go to boms tab
      await user.click(screen.getByRole("tab", { name: "BOMs" }));

      // Get the table element
      const table = screen.getByRole("table");

      // Get all rows within the table
      const rows = within(table).getAllByRole("row");

      // Skip the header row (assuming first row is header)
      const dataRows = rows.slice(1);

      // Extract text from the first cell of each data row
      const tableData = dataRows.map((row) => {
        const cells = within(row).getAllByRole("cell");
        // return cells[0].textContent?.trim() ?? ""; // Trim to handle whitespace
        return {
          bomId: cells[0].textContent?.trim() ?? "",
          status: cells[2].textContent?.trim() ?? "",
        };
      });

      // Assert the IDs match exactly
      expect(tableData).toEqual([
        { bomId: "BOM-1", status: "Latest" },
        { bomId: "BOM-2", status: "Unspecified" },
        { bomId: "BOM-3", status: "Historical" },
      ]);
    });
  });

  describe("Components tab", () => {
    it("has Components table", async () => {
      const user = userEvent.setup();
      await act(async () => {
        return render(<Page />);
      });

      // go to components tab
      await user.click(screen.getByRole("tab", { name: "Components" }));

      // Get the table element
      const table = screen.getByRole("table");

      // Get all rows within the table
      const rows = within(table).getAllByRole("row");

      // get the first row (header)
      const headerRow = rows[0];

      // get the header cells
      const headerCells = within(headerRow).getAllByRole("columnheader");

      // Extract text from the header cells
      const headerTexts = headerCells.map((cell) => cell.textContent);

      // Assert the header cells match exactly
      expect(headerTexts).toEqual([
        "Name",
        "Classification",
        "Version",
        "Ecosystem",
        "Created At",
        "Updated At",
      ]);
    });

    it("table matches", async () => {
      const user = userEvent.setup();
      await act(async () => {
        return render(<Page />);
      });

      // go to components tab
      await user.click(screen.getByRole("tab", { name: "Components" }));

      // Get the table element
      const table = screen.getByRole("table");

      // Get all rows within the table
      const rows = within(table).getAllByRole("row");

      // Skip the header row (assuming first row is header)
      const dataRows = rows.slice(1);

      // Extract entire table data
      const tableData = dataRows.map((row) => {
        const cells = within(row).getAllByRole("cell");
        return {
          name: cells[0].textContent?.trim() ?? "",
          classification: cells[1].textContent?.trim() ?? "",
          version: cells[2].textContent?.trim() ?? "",
          ecosystem: cells[3].textContent?.trim() ?? "",
        };
      });

      // Assert the table matches exactly
      expect(tableData).toEqual([
        {
          name: "Component 1",
          classification: "Library",
          version: "1.0.0",
          ecosystem: "Unspecified",
        },
        {
          name: "Component 2",
          classification: "Container",
          version: "2.0.0",
          ecosystem: "Cargo",
        },
      ]);
    });
  });
});
