import { Button } from "@/components/ui/button";
import { SQLConfig, SQLNamespace, sql } from "@codemirror/lang-sql";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";
import { SqlSchema } from "./actions";

interface Props {
  schemas: SqlSchema[];
  query?: string;
  execQueryFn?: (query: string) => void;
  execQueryInProgress?: boolean;
}

const defaultSqlQuery = `SELECT projects.name, projects.version from projects`;

function schemaToSqlConfig(schemas: SqlSchema[]): SQLConfig {
  const namespace: SQLNamespace = {};

  const tables: string[] = [];
  schemas.forEach((schema) => {
    tables.push(schema.name);

    schema.columns.forEach((column) => {
      namespace[column.name] = {
        self: { label: column.name, type: "column" },
        children: {},
      };
    });
  });

  return {
    schema: namespace,
    tables: tables.map((table) => ({ label: table, type: "table" })),
    defaultTable: "projects",
  };
}

export const SqlEditor = ({
  schemas,
  query,
  execQueryFn,
  execQueryInProgress,
}: Props) => {
  const [value, setValue] = useState<string>(defaultSqlQuery);
  const sqlSupport = sql(schemaToSqlConfig(schemas));
  const editorExtensions = [sqlSupport, EditorView.lineWrapping];

  const executeQuery = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      execQueryFn?.(value);
    },
    [value, execQueryFn],
  );

  // Synchronize the query with the parent component
  useEffect(() => {
    if (query) {
      setValue(query);
    }
  }, [query]);

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <form onSubmit={executeQuery} className="flex flex-col gap-4">
        <CodeMirror
          value={value}
          height="200px"
          extensions={editorExtensions}
          onChange={(value) => setValue(value)}
        ></CodeMirror>
        <Button type="submit" disabled={execQueryInProgress}>
          {execQueryInProgress ? "Executing Query..." : "Execute Query"}
        </Button>
      </form>
    </div>
  );
};
