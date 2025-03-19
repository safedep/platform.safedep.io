import { Auth0Provider } from "@auth0/nextjs-auth0";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import TanstackQueryProvider from "@/components/providers/tanstack-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeDep | Open Source Software Supply Chain Security Platform",
  description:
    "Welcome to SafeDep. Onboard to SafeDep cloud, generate authentication credentials and access platform APIs",
  icons: {
    icon: "/safedep.svg",
  },
};

/**
 * serves as a very minimal layout for the app. This layout is used for *ONLY*
 * consolidating the providers and the toaster. The actual layouts are in the
 * route groups.
 *
 * Rationale:
 * - auth does not need brand header and footer,
 * - however, it needs the providers and the toaster,
 * - also, the other pages need the brand header and footer.
 *
 * So the simple solution is to have a minimal layout that only contains the
 * providers and the toaster, and then have the actual layouts in the route
 * groups which contain the required components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Auth0Provider>
        <TanstackQueryProvider>
          <body className={`${geistSans.className} antialiased`}>
            {children}

            <Toaster />
            <ReactQueryDevtools />
          </body>
        </TanstackQueryProvider>
      </Auth0Provider>
    </html>
  );
}
