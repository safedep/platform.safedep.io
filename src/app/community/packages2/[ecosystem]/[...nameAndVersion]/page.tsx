import { notFound } from "next/navigation";
import { parseSchema, type ParamSchema } from "./schema";

export default async function Page({
  params,
}: {
  params: Promise<ParamSchema>;
}) {
  const output = parseSchema(await params);
  if (!output) {
    return notFound();
  }
  const { ecosystem, nameAndVersion } = output;

  return (
    <div className="flex flex-col gap-4">
      page {ecosystem} nameversion={nameAndVersion?.name} version=
      {nameAndVersion?.version}
    </div>
  );
}
