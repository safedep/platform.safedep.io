"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Key } from "lucide-react";
import Badge from "../../components/Badge";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = true; 
      setIsAuthenticated(authStatus);

      if (!authStatus) {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);
  if (!isAuthenticated) {
    return null; 
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
              Securedapp
            </Link>
            <Badge
              icon={Key}
              text="Keys"
              bgColor="bg-blue-500"
              textColor="text-white"
            />
          </div>

          <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none hover:bg-blue-500 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-md"
      >
        <User size={20} />
        <span>User Options</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 bg-white text-blue-600 rounded-lg shadow-md">
          <a
            href="#"
            className="block px-4 py-2 hover:bg-blue-50 rounded-t-lg"
          >
            Edit Profile
          </a>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-blue-50 rounded-b-lg"
            onClick={() => {
              alert("Logout clicked");
              setIsDropdownOpen(false); 
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
