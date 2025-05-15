"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CartIcon from "./cart-icon";

type Props = {};

const NavBar = ({}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

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
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = searchInputRef.current?.value;
    if (searchTerm && searchTerm.trim() !== "") {
      const newHistory = [
        searchTerm,
        ...searchHistory.filter((item) => item !== searchTerm),
      ].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      console.log("Searching for:", searchTerm);
      setShowHistory(false);
    }
  };

  const handleHistoryItemClick = (term: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = term;
      handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="bg-white dark:bg-black w-full sticky top-0 z-50 ">
      <div className="container mx-auto px-4 w-full">
        <div className="flex items-center justify-between lg:justify-center lg:gap-18 py-2 relative">
          {/* Logo */}
          <Link href="/" className="text-xl mr-4 shrink-0">
            <i className="bi bi-apple"></i>
          </Link>

          {/* Nav Main (hidden on mobile, shown if isOpen) */}
          <nav
            className={`${
              isOpen ? "flex" : "hidden"
            } flex-col absolute top-full left-0 w-full bg-white shadow-md z-40 p-4 
     lg:static lg:flex lg:flex-row lg:w-auto lg:bg-transparent lg:shadow-none lg:p-0 lg:gap-18 gap-4`}
          >
            <Link
              href="/category/iphone"
              className="text-sm py-2 px-4 lg:px-0 hover:bg-gray-100 lg:hover:bg-transparent"
            >
              iPhone
            </Link>
            <Link
              href="/category/ipad"
              className="text-sm py-2 px-4 lg:px-0 hover:bg-gray-100 lg:hover:bg-transparent"
            >
              iPad
            </Link>
            <Link
              href="/category/mac"
              className="text-sm py-2 px-4 lg:px-0 hover:bg-gray-100 lg:hover:bg-transparent"
            >
              Mac
            </Link>
            <Link
              href="/category/watch"
              className="text-sm py-2 px-4 lg:px-0 hover:bg-gray-100 lg:hover:bg-transparent"
            >
              Watch
            </Link>
            <Link
              href="/category/tai-nghe"
              className="text-sm py-2 px-4 lg:px-0 hover:bg-gray-100 lg:hover:bg-transparent"
            >
              Tai nghe
            </Link>
            <Link
              href="/category/phu-kien"
              className="text-sm py-2 px-4 lg:px-0 hover:bg-gray-100 lg:hover:bg-transparent"
            >
              Phụ kiện
            </Link>
          </nav>

          {/* Right Side: Search + Cart + Toggle */}
          <div className="flex items-center gap-4 lg:gap-18">
            {/* Search */}
            <div
              ref={searchContainerRef}
              className="relative max-w-[200px] md:max-w-none"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="py-1 px-8 text-sm border border-gray-300 rounded-full w-full lg:w-36 lg:focus:w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  onFocus={() => setShowHistory(true)}
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                >
                  <i className="bi bi-search text-sm text-gray-500"></i>
                </button>
              </form>
              {/* Lịch sử tìm kiếm */}
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

            {/* Cart Icon Component */}
            <CartIcon />

            {/* Toggle menu button (mobile only) */}
            <button
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <i className={`bi ${isOpen ? "bi-x" : "bi-list"} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
