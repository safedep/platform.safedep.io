import Footer from "@/components/Footer";
import UserActions from "@/components/header";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-svh">
      <header className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 m-8 px-0 sm:px-32">
        <div className="flex items-center gap-2">
          <Image src="/Logo.svg" alt="SafeDep Logo" width={80} height={80} />
        </div>
        <div className="flex items-center">
          <UserActions />
        </div>
      </header>

      <main className="grow">{children}</main>

      <Footer />
    </div>
  );
}
