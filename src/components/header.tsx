import UserMenu from "@/components/header/user-menu";
import Link from "next/link";
import Image from "next/image";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";

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
                width={25}
                height={25}
                priority
              />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/safedep/vet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="mr-4 gap-2">
              <span>Try vet</span>
              <SiGithub className="h-4 w-4" />
            </Button>
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
