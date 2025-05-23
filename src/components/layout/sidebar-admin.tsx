"use client";

import * as React from "react";
import {
  BarChart3,
  ShoppingCart,
  Package,
  ImageIcon,
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
import { getProfile } from "@/actions/auth";

const adminNavData = {
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
  ],
};

export function SidebarAdmin({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<any>(null);
  async function fetchUser() {
    const res = await getProfile();
    if (res && res) {
      setUser({
        name: res.full_name || "Chưa có tên",
        email: res.email,
        avatar: res.avatar_url || "",
      });
    }
  }

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser
          user={
            user || {
              name: "Admin",
              email: "admin@apple-zone.com",
              avatar: "",
            }
          }
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavData.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
