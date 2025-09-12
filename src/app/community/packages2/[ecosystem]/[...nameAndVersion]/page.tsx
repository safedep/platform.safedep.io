import { notFound } from "next/navigation";
import * as v from "valibot";

const schema = v.object({
  ecosystem: v.string(),
  nameAndVersion: v.pipe(v.array(v.string()), v.length(2)),
});

type ParamSchema = v.InferInput<typeof schema>;

export default async function Page({
  params,
}: {
  params: Promise<ParamSchema>;
}) {
  const { success, output } = v.safeParse(schema, params);
  if (!success) {
    return notFound();
  }

  const {
    ecosystem,
    nameAndVersion: [name, version],
  } = output;

  return (
    <div className="flex flex-col gap-4">
      page {ecosystem} name={name} version={version}
    </div>
  );
}
