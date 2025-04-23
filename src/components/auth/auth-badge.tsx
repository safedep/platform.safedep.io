import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  icon: LucideIcon;
  text: string;
  bgColor: string;
  textColor: string;
}

export default function Badge({
  icon: Icon,
  text,
  bgColor,
  textColor,
}: BadgeProps) {
  return (
    <div className={cn("flex items-center rounded-full px-3 py-1", bgColor)}>
      <Icon className={cn("mr-1 h-4 w-4", textColor)} />
      <span className={cn("text-xs font-medium", textColor)}>{text}</span>
    </div>
  );
}
