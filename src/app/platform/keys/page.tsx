"use client";

import { KeyIcon, List } from "lucide-react";
import MainHeader from "../components/header";
import Sidebar from "../components/sidebar";

const Page = () => {
  const sidebarItems = [
    { name: "List", icon: List, href: "/list" },  
  ];

  return (
    <div className="flex">
      <Sidebar items={sidebarItems} />
      <div className="flex-grow">
        <MainHeader>
          <KeyIcon className="h-12 w-12 inline-block" /> API Keys
        </MainHeader>
      </div>
    </div>
  );
};

export default Page;
