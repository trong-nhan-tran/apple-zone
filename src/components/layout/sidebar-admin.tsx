"use client";

import * as React from "react";
import {
  BarChart3,
  ShoppingCart,
  Package,
  ImageIcon,
  Users,
  Settings2,
  Layers,
  Grid3X3,
} from "lucide-react";

import { NavMain } from "@/components/ui-shadcn/nav-main";
import { NavUser } from "@/components/ui-shadcn/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui-shadcn/sidebar";

// Admin navigation data structure based on NavMainAdmin
const adminNavData = {
  user: {
    name: "Admin",
    email: "admin@apple-zone.com",
    avatar: "/images/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Tổng quan",
      url: "/admin/overview",
      icon: BarChart3,
    },
    {
      title: "Đơn hàng",
      url: "/admin/order",
      icon: ShoppingCart,
    },
    {
      title: "Danh mục",
      url: "/admin/category",
      icon: Grid3X3,
    },
    {
      title: "Dòng sản phẩm",
      url: "/admin/product",
      icon: Layers,
    },
    {
      title: "Sản phẩm",
      url: "/admin/product-item",
      icon: Package,
    },
    {
      title: "Banner",
      url: "/admin/banner",
      icon: ImageIcon,
    },
    {
      title: "Tài khoản",
      url: "/admin/user",
      icon: Users,
    },
    {
      title: "Cài đặt",
      url: "/admin/settings",
      icon: Settings2,
    },
  ],
};

export function SidebarAdmin({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={adminNavData.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavData.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
