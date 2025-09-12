"use server";

export default async function AnalysisTab({
  value,
}: {
  value: Promise<string>;
}) {
  const analysis = await value;

  return <div>AnalysisTab {analysis}</div>;
}
