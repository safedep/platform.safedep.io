import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getEcosystemIconByEcosystem } from "@/utils/ecosystem";
import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { Package, Star, GitFork, ExternalLink } from "lucide-react";
import PackageSafetyBadge from "./package-safety-badge";
import { SiGithub } from "react-icons/si";

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

function PackageName({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <Package className="size-6" />
      <span className="text-xl font-bold sm:text-4xl">{name}</span>
    </div>
  );
}

export default function PackageHeader({
  ecosystem,
  name,
  version,
  forks,
  stars,
  source,
}: {
  name: string;
  version: string;
  ecosystem: Ecosystem;
  forks: number;
  stars: number;
  source: URL;
}) {
  const EcosystemIcon = getEcosystemIconByEcosystem(ecosystem);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <PackageName name={name} />
            <PackageSafetyBadge safety="safe" />
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
              <Star className="size-3" />
              <span className="text-sm">{stars}</span>
            </HeaderBadge>
            <HeaderBadge>
              <GitFork className="size-3" />
              <span className="text-sm">{forks}</span>
            </HeaderBadge>

            <HeaderBadge variant="default">
              <SiGithub className="size-3!" />
              <a
                href={source.toString()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm"
              >
                <span>Source</span>
                <ExternalLink className="size-3" />
              </a>
            </HeaderBadge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
