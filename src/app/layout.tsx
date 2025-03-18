import { Auth0Provider } from "@auth0/nextjs-auth0";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "@/components/ui/sonner";
import TanstackQueryProvider from "@/components/providers/tanstack-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserActions from "@/components/header";
import Image from "next/image";
import LogoImage from "./auth/Logo.svg";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SafeDep | Open Source Software Supply Chain Security Platform",
  description:
    "Welcome to SafeDep. Onboard to SafeDep cloud, generate authentication credentials and access platform APIs",
  icons: {
    icon: "/safedep.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Auth0Provider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
        >
          <TanstackQueryProvider>
            <Theme>
              <div className="flex flex-col min-h-screen">
                <header className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 m-8 px-0 sm:px-32">
                  <div className="flex items-center gap-2">
                    <Image
                      src={LogoImage}
                      alt="SafeDep Logo"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="flex items-center">
                    <UserActions />
                  </div>
                </header>
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </Theme>
            <ReactQueryDevtools />
          </TanstackQueryProvider>
        </body>
      </Auth0Provider>
    </html>
  );
}
