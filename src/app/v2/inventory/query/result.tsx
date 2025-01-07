import { SqlQueryResponse } from "./actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  result?: SqlQueryResponse;
  generatedAt?: Date;
}

export const QueryResult = ({ result }: Props) => {
  return (
    <div className="flex flex-col mt-4">
      {result && result?.rows?.length > 0 ? (
        <Table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <TableCaption>Query Result</TableCaption>
          <TableHeader className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <TableRow>
              {result.rows[0].pairs.map((pair) => (
                <TableHead key={pair.column}>{pair.column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.rows.map((row, i) => (
              <TableRow
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                {row.pairs.map((pair, j) => (
                  <TableCell key={j}>{pair.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={result.rows[0].pairs.length}>
                Generated at: {result.generatedAt.toString()}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <div>No results</div>
      )}
    </div>
  );
};
