import { useEffect, useState } from "react";
import { remark } from "remark";
import html from "remark-html";

interface Props {
  content: string;
  className?: string;
}

function correctMarkdownFormatting(s: string): string {
  return s;
}

export default function MarkdownContent(props: Props) {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const processMarkdown = async (content: string) => {
      const data = await remark().use(html).process(content);
      setHtmlContent(data.toString());
    };

    processMarkdown(correctMarkdownFormatting(props.content));
  }, [props]);

  return (
    <div
      className={props.className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
