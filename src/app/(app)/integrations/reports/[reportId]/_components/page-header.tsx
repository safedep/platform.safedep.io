export default function PageHeader({ reportId }: { reportId: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold break-words">
        Scan report for <span className="font-mono">{reportId}</span>
      </h1>
    </div>
  );
}
