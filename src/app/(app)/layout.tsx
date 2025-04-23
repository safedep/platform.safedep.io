import type { ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />

      {/* occupy the remaining space */}
      <main className="flex min-h-full flex-1 flex-col bg-gray-100">
        {children}
      </main>

      {/* put footer at the bottom of the page */}
      <Footer />
    </div>
  );
}
