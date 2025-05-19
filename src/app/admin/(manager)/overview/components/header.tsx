"use client";
import React, { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui-shadcn/sidebar";

interface OverviewHeaderProps {}

export function OverviewHeader(props: OverviewHeaderProps) {
  return (
    <div className="bg-white px-3 py-4 shadow-sm sm:flex justify-between items-center">
      <div className="flex items-center gap-3 sm:mb-0 mb-2">
        <SidebarTrigger className="" />
        <h1 className="text-lg font-medium text-gray-800">Tổng quan</h1>
      </div>
    </div>
  );
}
