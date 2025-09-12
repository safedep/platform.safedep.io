import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getEcosystemIconByEcosystem } from "@/utils/ecosystem";
import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { Package } from "lucide-react";

function HeaderBadge({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant="outline"
      className={cn("flex items-center justify-center px-3", className)}
      {...props}
    >
      {children}
    </Badge>
  );
}

function SafetyDeterminerBadge() {
  return <span className="text-base">safety determiner badge</span>;
}

function PackageName({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <Package className="h-8 w-8" />
      <span className="text-4xl font-bold">{name}</span>
    </div>
  );
}

export default function PackageHeader({
  ecosystem,
  name,
  version,
}: {
  name: string;
  version: string;
  ecosystem: Ecosystem;
}) {
  const EcosystemIcon = getEcosystemIconByEcosystem(ecosystem);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <PackageName name={name} />
            <SafetyDeterminerBadge />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            <HeaderBadge>
              <EcosystemIcon className="size-6!" />
            </HeaderBadge>
            <HeaderBadge>
              <span className="text-sm">v{version}</span>
            </HeaderBadge>
            <HeaderBadge>
              <span className="text-sm">stars</span>
            </HeaderBadge>
            <HeaderBadge>
              <span className="text-sm">forks</span>
            </HeaderBadge>
            <HeaderBadge variant="default">
              <span className="text-sm">source</span>
            </HeaderBadge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
