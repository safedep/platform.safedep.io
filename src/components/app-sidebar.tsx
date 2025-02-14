"use client";

import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map as LucideMap,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Default Team",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inventory",
      url: "#",
      urlPrefix: "/v2/inventory",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Projects",
          url: "/v2/inventory/projects",
        },
        {
          title: "Components",
          url: "#",
        },
        {
          title: "Query",
          url: "/v2/inventory/query",
        },
      ],
    },
    {
      title: "Policy Groups",
      url: "#",
      urlPrefix: "/v2/policy-management",
      icon: Bot,
      items: [
        {
          title: "All Groups",
          url: "/v2/policy-management/manage",
        },
        {
          title: "New Group",
          url: "/v2/policy-management/new",
        },
      ],
    },
    {
      title: "Policies",
      url: "#",
      urlPrefix: "/v2/policy",
      icon: Bot,
      items: [
        {
          title: "All Policies",
          url: "/v2/policy/list",
        },
        {
          title: "New Policy",
          url: "/v2/policy/new",
        },
        {
          title: "Violations",
          url: "/v2/policy/violations",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      urlPrefix: "/v2/settings",
      icon: Settings2,
      items: [
        {
          title: "API Keys",
          url: "/v2/settings/keys",
        },
        {
          title: "Team",
          url: "/v2/settings/team",
        },
        {
          title: "Integrations",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: LucideMap,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUser();
  const path = usePathname();

  React.useEffect(() => {
    for (const item of data.navMain) {
      if (path.startsWith(item.urlPrefix ?? "///")) {
        item.isActive = true;
      }
    }
  }, [path]);

  if (isLoading) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "",
            email: user?.email ?? "",
            avatar: user?.picture ?? "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
