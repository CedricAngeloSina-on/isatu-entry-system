import * as React from "react";
import Link from "next/link";
import { CarFront, GalleryVerticalEnd, List, Scan, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { LogoutButton } from "~/components/logout-button";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  isAdmin: string;
};

export function AppSidebar({ isAdmin, ...props }: AppSidebarProps) {
  const mainNavItems = [
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
    ...(isAdmin == "admin"
      ? [
          {
            title: "All Entry Logs",
            url: "/entry-logs",
            icon: List,
          },
        ]
      : []),
    {
      title: "My Entry Logs",
      url: "/my-entry-logs",
      icon: List,
    },
    {
      title: "My Vehicles",
      url: "/my-vehicles",
      icon: CarFront,
    },
    ...(isAdmin == "admin"
      ? [
          {
            title: "QR Scanner",
            url: "/qr-scanner",
            icon: Scan,
          },
        ]
      : []),
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/profile">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">ISAT-U Entry System</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
