import { useState } from "react";
import { Library, Plus } from "lucide-react";
import LogoMark from "./navbar.svg";
import Image from "next/image";
const sidebarItems = [
  { name: "List", icon: Library },
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("List");

  return (
    <aside className="h-screen bg-gray-900 text-white lg:w-64 w-16 transition-all duration-300">
      <div className="flex items-center justify-center py-4 lg:py-6">
        <Image
          src={LogoMark}
          alt="Logo"
          className="h-8 lg:h-10 w-auto"
        />
      </div>
      <div className="px-4">
        <button
          className="w-full py-2 mb-4 text-center text-purple-600 bg-purple-100 rounded hover:bg-purple-200 flex items-center justify-center"
        >
          <Plus className="h-6 w-6 lg:hidden" />
          <span className="hidden lg:block">+ Create</span>
        </button>
      </div>
      <nav className="flex flex-col space-y-1 px-4">
        {sidebarItems.map((item, index) => {
          const isActive = activeItem === item.name;
          return (
            <button
              key={index}
              className={`flex items-center gap-4 px-3 py-2 rounded text-left text-sm transition ${
                isActive
                  ? "bg-gray-800 text-purple-400"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              <item.icon className="h-6 w-6" />
              <span
                className={`flex-grow hidden lg:block transition ${
                  isActive ? "font-medium" : ""
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
