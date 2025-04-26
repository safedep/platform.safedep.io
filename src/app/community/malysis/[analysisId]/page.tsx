import { Metadata } from "next";
import MalysisClient from "./client";

export const metadata: Metadata = {
  title: "Malysis | Safedep Platform",
  description: "Malware analysis results by Safedep",
};

export default async function Page() {
  return <MalysisClient />;
}
