"use client";
import MalwareAnalysisError from "@/components/malysis/malysis-error";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex h-dvh items-start py-8">
      <MalwareAnalysisError message={error.message} />
    </div>
  );
}
