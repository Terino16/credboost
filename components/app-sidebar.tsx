"use client"

import type * as React from "react"
import {
  BarChartIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  FormInputIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SettingsIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react"

import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "johndoe",
    email: "john@example.com",
    avatar: "/avatars/shadcn.jpg",
    plan: "Paid",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Spaces",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Forms",
      url: "#",
      icon: FormInputIcon,
    },
    {
      title: "Reviews",
      url: "#",
      icon: MessageSquareIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
  ],
  navSpaces: [
    {
      title: "Product A",
      icon: StarIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Customer Reviews",
          url: "#",
        },
        {
          title: "Feedback Form",
          url: "#",
        },
      ],
    },
    {
      title: "Product B",
      icon: StarIcon,
      url: "#",
      items: [
        {
          title: "Customer Reviews",
          url: "#",
        },
        {
          title: "Feedback Form",
          url: "#",
        },
      ],
    },
    {
      title: "Product C",
      icon: StarIcon,
      url: "#",
      items: [
        {
          title: "Customer Reviews",
          url: "#",
        },
        {
          title: "Feedback Form",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Billing",
      url: "#",
      icon: CreditCardIcon,
    },
    {
      title: "Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
  documents: [
    {
      name: "Review Templates",
      url: "#",
      icon: FileTextIcon,
    },
    {
      name: "Form Builder",
      url: "#",
      icon: FormInputIcon,
    },
    {
      name: "Widgets",
      url: "#",
      icon: SparklesIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <StarIcon className="h-5 w-5" />
                <span className="text-base font-semibold">CredBoost</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

