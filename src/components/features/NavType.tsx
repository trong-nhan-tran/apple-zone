"use client";
import React, { useEffect } from "react";
import NavTypeLink from "./NavTypeLink";
import { useCategoryStore } from "@/store/category-store";
import { useParams } from "next/navigation";

type Props = {};

const NavType = (props: Props) => {
  const { categories, isLoading, error } = useCategoryStore();
  const {categorySlug} = useParams();
  const [navType, setNavType] = React.useState<{name: string; slug: string}[]>([]);
  const [parentCategorySlug, setParentCategorySlug] = React.useState<string>("");
  
  useEffect(() => {
    console.log("categorySlug", categorySlug);
    if (categorySlug && categories.length > 0) {
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        setNavType(category?.subcategories || []);
        setParentCategorySlug(String(categorySlug));
      } 
      
    }
  }, [categorySlug, categories]);
  
  return (
    <div className="flex gap-8 mt-10">
      {categorySlug && categories.length > 0 && (
        <>
          {parentCategorySlug && (
            <NavTypeLink
              href={`/category/${parentCategorySlug}`}
              name="Tất cả"
            />
          )}
          {navType.map((item) => (
            <NavTypeLink
              key={item.slug}
              href={`/category/${parentCategorySlug}/${item.slug}`}
              name={item.name}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default NavType;
