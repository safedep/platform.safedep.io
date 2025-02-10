import { describe, it, vi } from "vitest";
import Page from "./page";
import { render } from "@testing-library/react";
import { RuleCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/rule_pb";

vi.mock("./actions", () => ({
  listPolicyViolations: async () => ({
    violation: [
      {
        projectName: "projectName-1",
        projectVersion: "projectVersion-1",
        violation: {
          rule: {
            name: "ruleName-1",
            check: RuleCheck.POPULARITY,
          },
          detectedAt: {
            toDate: () => new Date("2021-01-01"),
          },
        },
        component: {
          name: "componentName-1",
          version: "componentVersion-1",
        },
      },
    ],
  }),
}));

describe("Violations page", async () => {
  it("should render", async () => {
    const page = await Page();
    render(page);
  });

  it("should render with data", async () => {
    const page = await Page();
    const { getByText } = render(page);
    getByText("projectName-1");
    getByText("projectVersion-1");
    getByText("ruleName-1");
    getByText("componentName-1@componentVersion-1");
    getByText("Popularity");
  });
});
