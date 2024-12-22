import React from "react";
import { LucideIcon } from "lucide-react";

interface BadgeProps {
  icon: LucideIcon;
  text: string;
  bgColor: string;
  textColor: string;
}

const Badge: React.FC<BadgeProps> = ({
  icon: Icon,
  text,
  bgColor,
  textColor,
}) => (
  <span
    className={`px-3 py-1 rounded-full text-xs flex items-center shadow-sm ${bgColor} ${textColor}`}
  >
    <Icon size={16} className="mr-1" />
    {text}
  </span>
);

export default Badge;
