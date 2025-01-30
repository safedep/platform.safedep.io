import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VersionList from "@/components/projects/version-list";

export default function ProjectDetails() {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border bg-card p-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            apache/maven
          </h1>
        </div>
        <VersionList />
      </div>

      {/* Metadata */}
      <div className="mb-6 text-sm text-muted-foreground">
        Last updated: 2 hours ago
      </div>

      {/* Info Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <span className="text-3xl font-bold">100</span>
            <span className="text-sm text-muted-foreground">
              Versions Available
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <span className="text-3xl font-bold">286</span>
            <span className="text-sm text-muted-foreground">BOMs</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Table */}
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="boms">BOMs</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">dependency-1</TableCell>
                <TableCell>v2.1.0</TableCell>
                <TableCell>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Secure
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">dependency-2</TableCell>
                <TableCell>v1.8.3</TableCell>
                <TableCell>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Secure
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">dependency-3</TableCell>
                <TableCell>v3.0.1</TableCell>
                <TableCell>
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                    Review Required
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="boms">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BOM ID</TableHead>
                <TableHead>Components</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">BOM-2024-001</TableCell>
                <TableCell>15 components</TableCell>
                <TableCell>2 days ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">BOM-2024-002</TableCell>
                <TableCell>23 components</TableCell>
                <TableCell>1 day ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">BOM-2024-003</TableCell>
                <TableCell>8 components</TableCell>
                <TableCell>5 hours ago</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
