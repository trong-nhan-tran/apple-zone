"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCategoryStore } from "@/store/category-store";
import { Separator } from "../ui/separator";
// Thêm import cho hook giỏ hàng (giả sử bạn đã có hook này)
import { useCartStore } from "@/store/cart-store"; // Adjust import based on your actual cart store

type Props = {};

const NavBar = ({}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { categories, fetchCategories, isLoading, error } = useCategoryStore();
  // Lấy số lượng sản phẩm từ cart store
  const { items } = useCartStore();

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    fetchCategories();

    // Load search history from localStorage
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Click outside to close history popup
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchCategories]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = searchInputRef.current?.value;
    if (searchTerm && searchTerm.trim() !== "") {
      // Add to search history (no duplicates)
      const newHistory = [
        searchTerm,
        ...searchHistory.filter((item) => item !== searchTerm),
      ].slice(0, 5); // Keep only 5 most recent searches

      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));

      // Implement search functionality here
      console.log("Searching for:", searchTerm);
      // Redirect to search results page
      // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;

      setShowHistory(false);
    }
  };

  const handleHistoryItemClick = (term: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = term;
      // Optional: Immediately submit the search
      handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="bg-white w-full flex flex-col items-center sticky top-0 z-50">
      <div className="bg-white w-full h-12 flex items-center justify-between px-4 lg:justify-center">
        {/* Mobile Navigation */}
        <div className="flex justify-between items-center w-full lg:hidden">
          <Link href="/" className="">
            <i className="bi bi-apple text-xl"></i>
          </Link>

          <div className="flex items-center gap-5">
            {/* Search Input for Mobile */}
            <div ref={searchContainerRef} className="relative">
              <div className="flex items-center">
                <div className="relative">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Tìm kiếm"
                      className="py-1 px-8 text-sm border border-gray-300 rounded-full w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onFocus={() => setShowHistory(true)}
                    />
                    <button
                      type="submit"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    >
                      <i className="bi bi-search text-sm text-gray-500"></i>
                    </button>
                  </form>
                </div>
              </div>

              {/* Search History Dropdown */}
              {showHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <span className="text-xs text-gray-500">
                      Lịch sử tìm kiếm
                    </span>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                  <ul className="max-h-48 overflow-y-auto">
                    {searchHistory.map((term, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                      >
                        <button
                          onClick={() => handleHistoryItemClick(term)}
                          className="w-full flex items-center text-left"
                        >
                          <i className="bi bi-clock-history mr-2 text-gray-400 text-xs"></i>
                          <span className="text-sm truncate">{term}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Cart Icon with Badge for Mobile */}
            <Link href={"/cart"} className="cursor-pointer relative">
              <i className="bi bi-bag text-xl"></i>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden" aria-label="Menu">
                  <i className="bi bi-list text-2xl"></i>
                </button>
              </SheetTrigger>
              <SheetContent side="top">
                <div className="flex flex-col gap-5 p-6">
                  {isLoading ? (
                    <div>Loading categories...</div>
                  ) : error ? (
                    <div>Error loading categories</div>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5 md:gap-16">
          <Link href="/" className="">
            <i className="bi bi-apple text-xl"></i>
          </Link>

          <Link href="/category/iphone" className="text-sm">
            iPhone
          </Link>
          <Link href="/category/ipad" className="text-sm">
            iPad
          </Link>
          <Link href="/category/mac" className="text-sm">
            Mac
          </Link>
          <Link href="/category/watch" className="text-sm">
            Watch
          </Link>
          <Link href="/category/tai-nghe" className="text-sm">
            Tai nghe
          </Link>
          <Link href="/category/phu-kien" className="text-sm">
            Phụ kiện
          </Link>

          {/* Search Input for Desktop */}
          <div ref={searchContainerRef} className="relative">
            <div className="flex items-center">
              <div className="relative">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="py-1 px-8 text-sm border border-gray-300 rounded-full w-36 focus:w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    onFocus={() => setShowHistory(true)}
                  />
                  <button
                    type="submit"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  >
                    <i className="bi bi-search text-sm text-gray-500"></i>
                  </button>
                </form>
              </div>
            </div>

            {/* Search History Dropdown */}
            {showHistory && searchHistory.length > 0 && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <span className="text-xs text-gray-500">
                    Lịch sử tìm kiếm
                  </span>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {searchHistory.map((term, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                    >
                      <button
                        onClick={() => handleHistoryItemClick(term)}
                        className="w-full flex items-center text-left"
                      >
                        <i className="bi bi-clock-history mr-2 text-gray-400 text-xs"></i>
                        <span className="text-sm truncate">{term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Cart Icon with Badge for Desktop */}
          <Link href={"/cart"} className="cursor-pointer relative">
            <span className="globalnav-image-compact">
              <svg
                height="48"
                viewBox="0 0 17 48"
                width="17"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m13.4575 16.9268h-1.1353a3.8394 3.8394 0 0 0 -7.6444 0h-1.1353a2.6032 2.6032 0 0 0 -2.6 2.6v8.9232a2.6032 2.6032 0 0 0 2.6 2.6h9.915a2.6032 2.6032 0 0 0 2.6-2.6v-8.9231a2.6032 2.6032 0 0 0 -2.6-2.6001zm-4.9575-2.2768a2.658 2.658 0 0 1 2.6221 2.2764h-5.2442a2.658 2.658 0 0 1 2.6221-2.2764zm6.3574 13.8a1.4014 1.4014 0 0 1 -1.4 1.4h-9.9149a1.4014 1.4014 0 0 1 -1.4-1.4v-8.9231a1.4014 1.4014 0 0 1 1.4-1.4h9.915a1.4014 1.4014 0 0 1 1.4 1.4z"></path>
              </svg>
            </span>
            {/* {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )} */}
            <span className="absolute bottom-[12px] left-[-5px] bg-red-500 text-white text-xs rounded-full h-4 w-4  flex items-center justify-center">
              1
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
