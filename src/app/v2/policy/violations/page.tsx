import { listPolicyViolations } from "./actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Page() {
  const { violation } = await listPolicyViolations();

  const tableData = violation.map((v) => ({
    ruleName: v.rule?.name,
    ruleDescription: v.rule?.description,
    detectedAt: v.detectedAt?.toDate(),
    check: v.rule?.check,
  }));

  return (
    <div className="container mx-auto flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Policy Violations</h1>
      </div>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
