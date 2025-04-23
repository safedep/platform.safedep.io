import { cn } from "@/lib/utils";
import { remark } from "remark";
import html from "remark-html";

export default function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const htmlContent = remark().use(html).processSync(content);

  return (
    <div
      className={cn(
        "prose dark:prose-invert prose-code:after:content-none prose-code:before:content-none prose-code:font-mono max-w-none",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
