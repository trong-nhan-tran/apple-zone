"use client";
import React from "react";
import NavSubcategoryLink from "./nav-subcategory-link";

type NavItem = {
  name: string;
  slug: string;
};

type Props = {
  navItems: NavItem[];
  parentSlug: string | null;
};

const NavSubcategory = ({ navItems = [], parentSlug = null }: Props) => {
  if (!navItems.length) return null;

  return (
    <div className="flex gap-8 mt-10">
      {parentSlug && (
        <NavSubcategoryLink href={`/category/${parentSlug}`} name="Tất cả" />
      )}
      {navItems.map((item) => (
        <NavSubcategoryLink
          key={item.slug}
          href={`/category/${item.slug}`}
          name={item.name}
        />
      ))}
    </div>
  );
};

export default NavSubcategory;
