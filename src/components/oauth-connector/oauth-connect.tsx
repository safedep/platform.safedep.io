import { cn } from "@/lib/utils";

/**
 * A component that displays an OAuth connection flow. Provides a consistent
 * layout for OAuth connection flows page.
 */
export default function OauthConnect({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "container flex max-w-2xl flex-1 flex-col items-center py-8 md:py-12",
        className,
      )}
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full border bg-white p-3 shadow-sm">
          {icon}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      </div>

      {children}
    </div>
  );
}
