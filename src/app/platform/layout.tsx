'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Navbar from "./components/navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />
      <main className="flex-1 mb-4 container mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
        {children}
      </main>
    </div>
  )
}

export default Layout;
