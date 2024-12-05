"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { User, Key } from "lucide-react";
import Badge from "../../components/Badge";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/platform/keys"
              className="text-sm font-medium hover:bg-blue-500 px-4 py-2 rounded-lg transition-all"
            >
              Safedep
            </Link>
            <Badge
              icon={Key}
              text="Keys"
              bgColor="bg-blue-500"
              textColor="text-white"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none hover:bg-white bg-white text-blue-600 px-4 py-2 rounded-lg transition-all shadow-md"
            >
              <User size={20} />
              <span>{user.name || "User Options"}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-blue-600 rounded-lg shadow-md">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-blue-50 rounded-t-lg"
                >
                  Edit Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-blue-50 rounded-b-lg"
                  onClick={async () => {
                    await fetch("/api/auth/logout");
                    router.push("/");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 mb-4 container mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
