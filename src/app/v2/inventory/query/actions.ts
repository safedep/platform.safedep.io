"use server";
import { createQueryServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";
import { timestampDate } from "@bufbuild/protobuf/wkt";

export interface SqlSchema {
  name: string;
  columns: SqlSchemaColumn[];
}

export interface SqlSchemaColumn {
  name: string;
  description: string;
  filterable: boolean;
  selectable: boolean;
  required: boolean;
  reference_url: string;
}

export interface SqlQueryResponsePair {
  column: string;
  value: string;
}

export interface SqlQueryResponseRow {
  pairs: SqlQueryResponsePair[];
}

export interface SqlQueryResponse {
  generatedAt: Date;
  rows: SqlQueryResponseRow[];
}

export async function serverExecuteQueryGetSchema() {
  const { tenant, accessToken } = await getTenantAndToken();
  const client = createQueryServiceClient(tenant, accessToken as string);

  const schemas = new Array<SqlSchema>();
  const response = await client.getSqlSchema({});

  response.schemas.forEach((schema) => {
    const columns = new Array<SqlSchemaColumn>();
    schema.columns.forEach((column) => {
      columns.push({
        name: column.name,
        description: column.description,
        filterable: column.filterable,
        selectable: column.selectable,
        required: column.required,
        reference_url: column.referenceUrl,
      });
    });

    schemas.push({
      name: schema.name,
      columns,
    });
  });

  return schemas;
}

export async function serverExecuteQuery(
  query: string,
): Promise<SqlQueryResponse> {
  const { tenant, accessToken } = await getTenantAndToken();
  const client = createQueryServiceClient(tenant, accessToken as string);
  const response = await client.queryBySql({ query, pageSize: 100 });

  const rows = new Array<SqlQueryResponseRow>();
  response.rows.forEach((row) => {
    const pairs = new Array<SqlQueryResponsePair>();
    const keys = Object.keys(row);

    const columns = new Array<string>();
    keys.forEach((key) => {
      columns.push(key);
    });

    // This sort order should ideally match the order of columns in
    // the query string.
    columns.sort().forEach((column) => {
      pairs.push({
        column,
        value: row[column]?.toString() ?? "",
      });
    });

    rows.push({ pairs });
  });

  return {
    generatedAt: response.generatedAt
      ? timestampDate(response.generatedAt)
      : new Date(),
    rows,
  };
}
