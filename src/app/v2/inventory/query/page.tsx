"use client";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/v2/page_header";
import { CircleX, SearchCodeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import SchemaHelp from "./help";
import {
  SqlQueryResponse,
  serverExecuteQuery,
  serverExecuteQueryGetSchema,
} from "./actions";
import { toast } from "@/hooks/use-toast";
import { SqlSchema } from "./actions";
import { LoadingSpinnerWithMessage } from "@/components/loading_spinner_with_message";
import { SqlEditor } from "./editor";
import { QueryResult } from "./result";
import { QueryAssist } from "./assist";

const QueryPage = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [schemas, setSchemas] = useState<SqlSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);
  const [query, setQuery] = useState<string | undefined>();
  const [queryResult, setQueryResult] = useState<SqlQueryResponse | null>();

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

  const executeQuery = (query: string) => {
    console.log("Executing query: ", query);
    setIsExecutingQuery(true);
    setQueryResult(null);
    serverExecuteQuery(query)
      .then((response) => {
        setQueryResult(response);
      })
      .catch((error) => {
        toast({
          title: "Error Executing Query",
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsExecutingQuery(false);
      });
  };

  return (
    <div className="container mx-auto">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 scroll-m-20 border-b">
        <div className="flex items-center gap-2">
          <PageHeader title="Query Inventory (BOM)" icon={SearchCodeIcon} />
        </div>
        <div className="flex items-center gap-2 px-4 ml-auto">
          <Button onClick={() => setShowHelp(true)}>Help</Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {showHelp && (
          // Create a panel for rendering help component. The panel should have
          // an icon that can be clicked to close the panel. On click
          // setShowHelp(false)
          <div className="flex flex-col gap-4 mt-2 rounded-md p-4">
            <div className="flex items-center gap-2 pb-1 border-b">
              <div className="flex items-center gap-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Schema
                </h3>
              </div>
              <div className="flex items-center gap-2 px-4 ml-auto">
                <CircleX
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setShowHelp(false)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SchemaHelp />
            </div>
            <div className="flex p-4 items-center gap-2 pt-2 border-t">
              <Button onClick={() => setShowHelp(false)}>Close</Button>
            </div>
          </div>
        )}
        {!showHelp && (
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              {isLoading && (
                <div className="flex p-2">
                  <LoadingSpinnerWithMessage message="Loading schema..." />
                </div>
              )}

              {!isLoading && (
                <SqlEditor
                  schemas={schemas}
                  query={query}
                  execQueryFn={executeQuery}
                  execQueryInProgress={isExecutingQuery}
                />
              )}

              {!isExecutingQuery && !isLoading && queryResult && (
                <QueryResult result={queryResult} />
              )}
            </div>
            <div className="col-span-1">
              <QueryAssist setQueryFn={setQuery} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryPage;
