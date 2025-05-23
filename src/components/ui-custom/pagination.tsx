import React from "react";
import { Button } from "@/components/ui-shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-shadcn/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end pages to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, startPage + 2);

      // Adjust if at the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        endPage = totalPages - 1;
        startPage = Math.max(2, endPage - 2);
      }

      // Add ellipsis if needed before startPage
      if (startPage > 2) {
        pages.push("...");
      }

      // Add page numbers between start and end
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after endPage
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page if there are multiple pages
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-white border-t border-gray-200 py-1">
      <div className="container mx-auto px-4">
        <div className="py-2 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Info section */}
          <div className="text-sm text-gray-600 font-medium">
            <span className="hidden sm:inline">Hiển thị </span>
            <span className="font-semibold text-gray-800">
              {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>
            <span className="mx-1">-</span>
            <span className="font-semibold text-gray-800">
              {Math.min(currentPage * pageSize, total)}
            </span>
            <span className="mx-1">trong</span>
            <span className="font-semibold text-gray-800">{total}</span>
            <span className="hidden sm:inline"> kết quả</span>
          </div>

          {/* Controls section */}
          <div className="flex items-center gap-4">
            {/* Page size selector */}
            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Hiển thị
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-9 w-[70px] border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {pageSizeOptions.map((size) => (
                      <SelectItem
                        key={size}
                        value={size.toString()}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-gray-200">
              {/* Previous button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrevious}
                className={`h-9 px-3 rounded-none border-r border-gray-200 ${
                  !canGoPrevious
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
                title="Trang trước"
              >
                <i className="bi bi-chevron-left" />
              </Button>

              {/* Page numbers */}
              {pageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="h-9 px-3 flex items-center justify-center text-gray-500 border-r border-gray-200">
                      &hellip;
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPageChange(page as number)}
                      className={`h-9 min-w-[36px] rounded-none border-r border-gray-200 ${
                        currentPage === page
                          ? "bg-blue-50 text-blue-600 font-medium hover:bg-blue-100"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}

              {/* Next button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
                className={`h-9 px-3 rounded-none ${
                  !canGoNext
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
                title="Trang tiếp"
              >
                <i className="bi bi-chevron-right" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
