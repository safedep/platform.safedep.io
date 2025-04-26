import { cn } from "@/lib/utils";
import Markdown from "react-markdown";

export default function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert prose-code:after:content-none prose-code:before:content-none prose-code:font-mono max-w-none",
        className,
      )}
    >
      <Markdown>{content}</Markdown>
    </div>
  );
}
