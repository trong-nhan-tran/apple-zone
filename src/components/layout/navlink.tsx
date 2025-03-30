"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  href: string;
  name: string;
}

const NavLink = ({
  href = "/",
  name = "",
}: Props) => {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
  <Link
    className={` text-gray-400 hover:text-gray-900 ${
    isActive ? "text-gray-900 font-bold" : ""
    }`}
    href={href}
  >
    {name}
  </Link>
  );
}

export default NavLink;