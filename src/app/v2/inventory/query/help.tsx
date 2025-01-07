"use client";

import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { SqlSchema, serverExecuteQueryGetSchema } from "./actions";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { LoadingSpinnerWithMessage } from "@/components/loading_spinner_with_message";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

function SchemaHelp() {
  const [schemas, setSchemas] = useState<SqlSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: We should take this as a prop to avoid reloading
  useEffect(() => {
    serverExecuteQueryGetSchema()
      .then((response) => {
        setSchemas(response);
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Error Fetching Schema",
          description: error.message,
          variant: "destructive",
        });
      });
  }, []);

  const schemaTable = (schema: SqlSchema) => (
    <Table className="w-full">
      <TableCaption>Available columns for {schema.name}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Filterable</TableHead>
          <TableHead>Selectable</TableHead>
          <TableHead>Required</TableHead>
          <TableHead className="text-right">Reference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schema.columns.map((col) => (
          <TableRow key={col.name}>
            <TableCell className="font-medium">
              <Badge>{col.name}</Badge>
            </TableCell>
            <TableCell>{col.description}</TableCell>
            <TableCell>{col.filterable ? "Yes" : "No"}</TableCell>
            <TableCell>{col.selectable ? "Yes" : "No"}</TableCell>
            <TableCell>{col.required ? "Yes" : "No"}</TableCell>
            <TableCell className="text-right">
              {col.reference_url !== "" && (
                <Link href={col.reference_url} target="_blank">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinnerWithMessage message="Loading schema details" />
      </div>
    );
  }

  return (
    <div>
      {schemas.map((schema) => (
        <div key={schema.name}>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="p-2 bg-gray-200 rounded-md text-lg font-semibold pb-2">
                {schema.name}
              </AccordionTrigger>
              <AccordionContent className="p-2 bg-gray-100 rounded-md">
                {schemaTable(schema)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export default SchemaHelp;
