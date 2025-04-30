import type { Report_Warning } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import { AlertTriangle } from "lucide-react";

export default function MalysisWarningsTab({
  warnings,
}: {
  warnings: Report_Warning[];
}) {
  return (
    <ul className="space-y-4">
      {warnings.map((warning) => (
        <li className="grid gap-4" key={warning.message}>
          <div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-4">
            <AlertTriangle className="text-red-700 dark:text-red-400" />
            <div className="space-y-1">
              <p className="font-medium">{warning.message}</p>
              {/* NOTE: this is here in case we add details to message */}
              {/* <p className="text-sm text-muted-foreground">
                Multiple unauthorized connection attempts detected to known
                malicious domains. Potential data exfiltration behavior
                observed.
              </p> */}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
