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
      className={`relative transition-all duration-300 
        before:absolute before:bottom-0 before:left-0 
        before:h-[2px] before:w-0 before:bg-black before:transition-all 
        before:duration-300 hover:before:w-full 
        ${isActive ? "before:w-full" : ""}`}
      href={href}
    >
      {name}
    </Link>
  );
};

export default NavTypeLink; 
