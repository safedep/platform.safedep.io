import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SafeDep Platform",
    default: "SafeDep | Open Source Software Supply Chain Security Platform",
  },
  description:
    "Welcome to SafeDep. Onboard to SafeDep cloud, generate authentication credentials and access platform APIs",
  keywords: ["SafeDep", "Open Source", "Supply Chain", "Security", "Platform"],
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
      <body
        className={`${inter.className} ${jetBrainsMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster richColors closeButton theme="light" />
      </body>
    </html>
  );
}
