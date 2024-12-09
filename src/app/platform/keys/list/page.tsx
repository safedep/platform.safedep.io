"use client";

import { KeyIcon } from "lucide-react";
import MainHeader from "../../components/header";
import Sidebar from "../../components/sidebar";
import { ApiKeyNavigations } from "../navigations";

const Page = () => {
  return (
    <div className="flex">
      <Sidebar items={ApiKeyNavigations} />
      <div className="flex-grow pl-4">
        <MainHeader>
          <KeyIcon className="h-12 w-12 inline-block" /> API Keys
        </MainHeader>
      </div>
    </div>
  );
};

export default Page;
