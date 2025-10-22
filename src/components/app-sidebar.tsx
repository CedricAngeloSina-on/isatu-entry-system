"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, List, Scan, User } from "lucide-react";
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
  const pathname = usePathname();

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
    <Sidebar {...props} className="border-none print:hidden">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              disabled
              className="bg-primary"
            >
              <div>
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={30}
                    height={30}
                    className="size-8 rounded-sm"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">ISAT-U Entry System</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-muted text-white"
                    }`}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
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
