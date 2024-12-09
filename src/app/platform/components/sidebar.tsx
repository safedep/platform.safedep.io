"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
interface SidebarItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}
interface SidebarProps {
  items: SidebarItem[];
}
const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const [activeItem, setActiveItem] = useState(items[0]?.name || "");
  return (
    <aside className="h-screen bg-gray-900 pt-4 pb-4 border rounded  text-white lg:w-64 w-16 transition-all duration-300">
      <div className="px-4">
        <button className="w-full py-2 mb-4 text-center text-purple-600 bg-purple-100 rounded hover:bg-purple-200 flex items-center justify-center">
          <Plus className="h-6 w-6 lg:hidden" />
          <span className="hidden lg:block">+ Create</span>
        </button>
      </div>
      <nav className="flex flex-col space-y-1 px-4">
        {items.map((item, index) => {
          const isActive = activeItem === item.name;
          return (
            <Link
              key={index}
              href={item.href}
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
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
export default Sidebar;
