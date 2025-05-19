"use client";
import { SidebarAdmin } from "@/components/layout/sidebar-admin";
import { SidebarInset, SidebarProvider } from "@/components/ui-shadcn/sidebar";

export default function AdminManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <SidebarAdmin />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
