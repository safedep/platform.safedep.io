"use client";

import Link from "next/link";
import React from "react";
import { useState } from "react";

const Footer: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useState(() => {
    setYear(new Date().getFullYear());
  });

  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p>&copy; {year} SafeDep</p>

      <p className="text-sm">
        <Link href="#" className="text-white">
          Terms of Service
        </Link>
        {" | "}
        <Link href="#" className="text-white">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
