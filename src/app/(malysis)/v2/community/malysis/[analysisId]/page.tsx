import { AlertTriangle, ArrowUpRight } from "lucide-react";
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

// TODO: flesh it out into a component, get data from API
export default function Page() {
  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
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
        <Badge variant="destructive" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Possibly Malicious
        </Badge>
      </div>

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
            associated with malware. Further investigation is recommended before
            use.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="evidences">
        <TabsList>
          <TabsTrigger value="evidences">Evidences</TabsTrigger>
          <TabsTrigger value="filesystems">Filesystems</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
        </TabsList>
        <TabsContent value="evidences" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">File</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono">index.js</TableCell>
                  <TableCell>2.4KB</TableCell>
                  <TableCell>JavaScript</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">package.json</TableCell>
                  <TableCell>0.8KB</TableCell>
                  <TableCell>JSON</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="filesystems" className="mt-4">
          <Card>
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
                  <TableCell className="font-mono">/usr/local/bin</TableCell>
                  <TableCell>rwxr-xr-x</TableCell>
                  <TableCell>2024-01-20</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="warnings" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <span>Suspicious network connections detected</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <span>Unauthorized file system access attempts</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
