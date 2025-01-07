import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
}

export default function PageHeader(props: PageHeaderProps) {
  return (
    <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight">
      <span className="inline-flex items-center">
        {props.icon && <props.icon className="w-6 h-6 mr-2" />}
        {props.title}
      </span>
    </h2>
  );
}
