import UserMenu from "@/components/user-menu";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-col border-b px-4">
      <div className="flex h-18 items-center justify-between">
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/safedep-logo.svg"
                alt="Safedep Logo"
                width={160}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
        </div>

        <UserMenu />
      </div>
    </header>
  );
}

/**
 * 
 * import { UserMenu } from "@/components/user-menu"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/safedep-logo.svg" alt="Safedep Logo" width={140} height={50} className="h-10 w-auto" priority />
          </Link>
        </div>

        <UserMenu />
      </div>
    </header>
  )
}

 */
