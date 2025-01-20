import { AlertTriangle, ArrowUpRight, Shield, XOctagon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvidenceRow } from "@/components/EvidenceRow";

type MalwareStatus = "safe" | "possibly-malicious" | "malicious";

const statusConfig: Record<
  MalwareStatus,
  { color: string; label: string; theme: string; icon: JSX.Element }
> = {
  safe: {
    color: "border-l-green-500",
    label: "Safe",
    theme: "text-green-700 dark:text-green-400",
    icon: <Shield className="h-4 w-4" />,
  },
  "possibly-malicious": {
    color: "border-l-yellow-400",
    label: "Possibly Malicious",
    theme: "text-yellow-700 dark:text-yellow-400",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  malicious: {
    color: "border-l-red-500",
    label: "Malicious",
    theme: "text-red-700 dark:text-red-400",
    icon: <XOctagon className="h-4 w-4" />,
  },
};

const evidences = [
  {
    name: "unsigned_bitwise_math_excess",
    type: "YARA Analyzer",
    confidence: "Medium" as const,
    behavior:
      "Uses an excessive amount of unsigned bitwise math operations, commonly associated with obfuscated malicious code.",
    details: [
      "$function",
      "function(",
      "$charAt",
      "charAt(",
      "$left",
      "n>>>1",
      "$right",
      "n>>>1",
    ],
    file: "package/dist/vue2-zhongke-plugins-call.min.js",
  },
  {
    name: "suspicious_eval_usage",
    type: "Static Analysis",
    confidence: "High" as const,
    behavior:
      "Contains multiple instances of eval() function calls with dynamic content.",
    details: [
      "eval(",
      "new Function(",
      "setTimeout(string",
      "setInterval(string",
    ],
    file: "package/dist/core.min.js",
  },
];

export default function MalwareAnalysisResult() {
  const status: MalwareStatus = "malicious";
  const { color, label, theme } = statusConfig[status];

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card className={`border-l-4 ${color}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-mono group">
              <a
                href="https://www.npmjs.com/package/npm-package-name"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-primary gap-1"
              >
                npm-package-name@1.2.3
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </h1>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium ${theme}`}
            >
              {statusConfig[status].icon}
              {label}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Confidence:</span>
                <Badge variant="secondary">Medium</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inference Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This package exhibits suspicious behavior patterns commonly
                associated with malware. Further investigation is recommended
                before use.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="evidences">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="evidences">Evidences</TabsTrigger>
                  <TabsTrigger value="filesystems">Filesystems</TabsTrigger>
                  <TabsTrigger value="warnings">Warnings</TabsTrigger>
                </TabsList>
                <TabsContent value="evidences" className="mt-4">
                  <div className="space-y-2">
                    {evidences.map((evidence, index) => (
                      <EvidenceRow key={index} {...evidence} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="filesystems" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Path</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Modified</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">
                          /usr/local/bin
                        </TableCell>
                        <TableCell>rwxr-xr-x</TableCell>
                        <TableCell>2024-01-20</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="warnings" className="mt-4">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-2">
                      <AlertTriangle
                        className={`h-5 w-5 shrink-0 mt-0.5 ${theme}`}
                      />
                      <span>Suspicious network connections detected</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle
                        className={`h-5 w-5 shrink-0 mt-0.5 ${theme}`}
                      />
                      <span>Unauthorized file system access attempts</span>
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
