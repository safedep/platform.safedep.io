"use client";

import Link from "next/link";
import React from "react";
import { useState } from "react";
import { externalUrls } from "@/lib/config";

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useState(() => {
    setYear(new Date().getFullYear());
  });

  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p>&copy; {year} SafeDep</p>

      <p className="text-sm">
        <Link href={externalUrls.termsOfService} className="text-white">
          Terms of Service
        </Link>
        {" | "}
        <Link href={externalUrls.privacyPolicy} className="text-white">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}

export default Footer;
