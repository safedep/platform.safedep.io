import Badge from "@/components/Badge";
import { LucideIcon, TimerIcon } from "lucide-react";

type LoadingProps = {
  badge?: LucideIcon;
  message: string;
  bgColor?: string;
  textColor?: string;
};

export const Loading: React.FC<LoadingProps> = (props: LoadingProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Badge
        icon={props.badge || TimerIcon}
        text={props.message}
        bgColor={props.bgColor || "bg-blue-100"}
        textColor={props.textColor || "text-blue-700"}
      />
    </div>
  );
}

