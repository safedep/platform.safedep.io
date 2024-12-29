interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "warning" | "danger" | "outline";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium";
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    outline: "border border-gray-200 text-gray-600",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
