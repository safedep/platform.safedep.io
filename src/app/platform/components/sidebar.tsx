"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  target?: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <aside
      className="min-h-96  bg-gray-900 pt-4
      pb-4 border  rounded-2xl  text-white lg:w-64 w-16 transition-all duration-300"
    >
      <nav className="flex flex-col space-y-1 px-4">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              target={item.target}
              className={`flex items-center gap-4 px-3 py-2 rounded text-left text-sm transition ${
                isActive ? "bg-gray-800 text-purple-400" : "hover:bg-gray-700"
              }`}
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
