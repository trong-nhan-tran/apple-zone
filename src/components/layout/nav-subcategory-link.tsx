"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  name: string;
};

const NavTypeLink = ({ href = "/", name = "" }: Props) => {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <Link
      href={href}
      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-300
        ${
          isActive
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      {name}
    </Link>
  );
};

export default NavTypeLink;
