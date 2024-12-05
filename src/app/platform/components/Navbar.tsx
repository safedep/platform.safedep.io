"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { User, Key, LogOut, Settings } from "lucide-react";
import Badge from "../../../components/Badge";

export default function Navbar() {
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

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/platform/keys" className="text-sm font-medium hover:bg-blue-500 px-4 py-2 rounded-lg transition-all">
            Safedep
          </Link>
          <Link href="/platform/keys">
            <Badge icon={Key} text="Keys" bgColor="bg-blue-500" textColor="text-white" />
          </Link>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none 
            bg-white/20 hover:bg-white/30 text-white 
            px-4 py-2 rounded-lg transition-all 
            transform hover:scale-105 active:scale-95 
            shadow-md group"
          >
            <User size={20} className="group-hover:rotate-12 transition-transform" />
            <span>{user.name || "User Options"}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 
              bg-white text-blue-600 
              rounded-lg shadow-xl 
              border border-blue-100 
              w-48 
              animate-[dropdown_0.2s_ease-out]"
            >
              <Link 
                href="/profile" 
                className="flex items-center space-x-2 
                px-4 py-2 hover:bg-blue-50 
                rounded-t-lg 
                transition-colors 
                group"
              >
                <Settings size={16} className="text-blue-400 group-hover:rotate-45 transition-transform" />
                <span>Edit Profile</span>
              </Link>
              <button
                className="flex items-center space-x-2 
                w-full text-left 
                px-4 py-2 hover:bg-blue-50 
                rounded-b-lg 
                transition-colors 
                group"
                onClick={async () => {
                  await fetch("/api/auth/logout");
                  router.push("/");
                }}
              >
                <LogOut size={16} className="text-red-400 group-hover:translate-x-1 transition-transform" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}