import React, { ReactNode } from "react";
import { Button } from "@/components/ui-shadcn/button";
import { Input } from "@/components/ui-shadcn/input";
import { SidebarTrigger } from "../ui-shadcn/sidebar";
import { Separator } from "@radix-ui/react-separator";

interface TableHeaderProps {
  title: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (e: React.FormEvent) => void;
  onAddNew?: () => void;
  children?: ReactNode;
}

export function TableHeader({
  title,
  searchValue = "",
  onSearchChange,
  onSearch,
  onAddNew,
  children,
}: TableHeaderProps) {
  const hasSearch = onSearchChange !== undefined && onSearch !== undefined;
  const hasAddNew = onAddNew !== undefined;

  return (
    <div className="bg-white px-3 py-4 shadow-sm sm:flex justify-between items-center">
      <div className="flex items-center gap-3 sm:mb-0 mb-2">
        <SidebarTrigger className="" />
        <h1 className="text-lg font-medium text-gray-800">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        {hasSearch && (
          <form onSubmit={onSearch} className="relative">
            <Input
              placeholder="Tìm kiếm"
              className="w-[240px] sm:w-[300px] pl-9 border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </form>
        )}

        {hasAddNew && (
          <Button
            type="button"
            onClick={onAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-sm"
          >
            <i className="bi bi-plus"></i>
            Thêm mới
          </Button>
        )}

        {children}
      </div>
    </div>
  );
}
