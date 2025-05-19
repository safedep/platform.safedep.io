import UserMenu from "@/components/header/user-menu";
import Link from "next/link";
import Image from "next/image";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  return (
    <header className="flex flex-col border-b px-4">
      <div className="flex h-18 items-center justify-between">
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/safedep-logo.svg"
                alt="SafeDep Logo"
                width={160}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="https://github.com/safedep/vet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                <SiGithub className="h-6 w-6 mr-2" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Try vet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <UserMenu />
      </div>
    </header>
  );
}
