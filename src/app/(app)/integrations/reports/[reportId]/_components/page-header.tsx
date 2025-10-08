export default function PageHeader({
  projectName,
  projectVersion,
}: {
  projectName: string;
  projectVersion: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold break-words">
        Scan report for <span className="font-mono">{projectName}</span>
      </h1>

      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Version:</span>
        <span className="font-mono">{projectVersion}</span>
      </div>
    </div>
  );
}
