import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import safedepSummaryReport from "./safedep-summary-report.png";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Successfully connected to GitHub",
  description:
    "You can now start managing your open source software supply chain security with SafeDep",
};

export default function ConnectSuccessPage() {
  return (
    <div className="flex items-center justify-center md:flex-1">
      <div className="container grid max-w-5xl items-center gap-8 py-8 md:py-12 lg:grid-cols-2">
        <div className="space-y-4 text-center lg:text-left">
          <div className="mb-2 flex items-center justify-center lg:justify-start">
            <div className="rounded-full border bg-white p-3 shadow-sm">
              <SiGithub className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            GitHub App Connected Successfully
          </h1>

          <p className="text-muted-foreground mt-2 text-sm">
            SafeDep App is now connected with your GitHub repositories, and
            securely linked with your SafeDep Tenant. You can continue using
            your GitHub while SafeDep protects you against open source risks.
          </p>

          <div className="pt-2">
            <Button size="lg" asChild>
              <a
                href="https://safedep.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Want more? See available upgrades
              </a>
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-sm lg:justify-start">
            <a
              href="https://docs.safedep.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Read docs <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
            <span className="text-muted-foreground" aria-hidden>
              ·
            </span>
            <a
              href="https://github.com/safedep/vet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Like it? We are open source
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="rounded-xl border bg-white p-2 shadow-sm">
            <Image
              src={safedepSummaryReport}
              alt="SafeDep Summary Report"
              priority
              placeholder="blur"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
