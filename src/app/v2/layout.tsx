import { AppHeader } from "@/components/user-details";
import Image from "next/image";
import LogoImage from "../auth/Logo.svg";
import UserActions from "@/components/header";
import Footer from "@/components/Footer";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 m-8 px-0 sm:px-32">
          <div className="flex items-center gap-2">
            <Image src={LogoImage} alt="SafeDep Logo" width={80} height={80} />
          </div>
          <div className="flex items-center">
            <UserActions />
          </div>
        </header>
        <div className="flex flex-col items-center mt-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
            Manage Keys
          </h1>
          <p className="text-base text-gray-600 mt-2">
            You can create, view, and delete API keys here.
          </p>
        </div>
        <div className="flex w-[90%] p-0 sm:p-7 lg:flex-row flex-col m-auto sm:items-center">
          <div className="flex items-center">
            <AppHeader />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4 pt-0">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
