import React from "react";
import Filter from "@/components/features/Filter";
import ProductCard from "@/components/features/ProductCard";
import ProductItemCard from "@/components/features/ProductItemCard";
import ShopBanner from "@/components/features/ShopBanner";
import NavSubcategory from "@/components/layout/nav-subcategory";
import {
  categoryService,
  productService,
  productItemService,
  bannerService,
} from "@/services";
import { ProductCardType, ProductItemType } from "@/schemas";
import prisma from "@/libs/prisma";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;

  let isParentCategory: boolean | null = null;
  let products: ProductCardType[] = [];
  let productItems: ProductItemType[] = [];
  let error: string | null = null;
  let categoryName: string = "";
  let category: any = null;
  let banners: any[] = [];
  let navigationItems: any[] = [];
  let parentSlug: string | null = null;
  let parentCategoryId: number | null = null;

  try {
    // Fetch category information - THIS IS THE SINGLE QUERY
    const categoryResponse = await categoryService.getBySlug(slug);

    if (categoryResponse.success && categoryResponse.data) {
      category = categoryResponse.data;
      categoryName = category.name;

      // Check if it's a parent or child category
      isParentCategory = category.parent_id === null;

      // DETERMINE PARENT CATEGORY INFO
      if (isParentCategory) {
        parentCategoryId = category.id;
        parentSlug = category.slug;
      } else {
        // For child category, get parent ID and slug
        parentCategoryId = category.parent_id;

        // Get parent category details if needed
        if (category.categories) {
          parentSlug = category.categories.slug;
        } else {
          // If categories relation wasn't included in the response, fetch it
          const parentResponse = await categoryService.getById(
            String(parentCategoryId)
          );
          if (parentResponse.success && parentResponse.data) {
            parentSlug = parentResponse.data.slug;
          }
        }
      }

      // FETCH BANNERS - always get banners for the parent category
      if (parentSlug) {
        const bannerResponse = await bannerService.getByCategory(parentSlug);
        if (bannerResponse.success && bannerResponse.data) {
          banners = bannerResponse.data;
        }
      }

      // FETCH NAVIGATION ITEMS
      if (isParentCategory) {
        // This is a parent category, show its subcategories
        // Get subcategories
        navigationItems = await prisma.categories.findMany({
          where: {
            parent_id: category.id,
          },
        });
      } else {
        // This is a child category, get siblings
        if (parentCategoryId) {
          navigationItems = await prisma.categories.findMany({
            where: {
              parent_id: parentCategoryId,
            },
          });
        }
      }

      // FETCH PRODUCTS
      if (isParentCategory) {
        // Fetch products for parent category
        const productsResponse = await productService.getAll(
          {
            categories: {
              slug: slug,
            },
          },
          {},
          { product_items: true }
        );

        if (productsResponse.success && productsResponse.data) {
          products = productsResponse.data;
        }
      } else {
        // For child category, use getAll with appropriate filter
        const productItemsResponse = await productItemService.getAll({
          categories: {
            slug: slug,
          },
        });

        if (productItemsResponse.success && productItemsResponse.data) {
          productItems = productItemsResponse.data;
        }
      }
    } else {
      error = categoryResponse.message || "Category not found";
    }
  } catch (err) {
    console.error("Error in category page:", err);
    error = "Failed to load data. Please try again later.";
  }

  return (
    <>
      {category && (
        <>
          <ShopBanner
            categoryName={categoryName}
            banners={banners.map((b) => b.url)}
          />
          <NavSubcategory navItems={navigationItems} parentSlug={parentSlug} />
        </>
      )}

      <Filter />
      <div className="grid mx-4 md:mx-0 grid-cols-2 md:grid-cols-3 gap-4 mt-10 ">
        {error ? (
          <div className="col-span-full text-center py-10 text-red-500">
            {error}
          </div>
        ) : isParentCategory === true && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : isParentCategory === false && productItems.length > 0 ? (
          productItems.map((item) => (
            <ProductItemCard key={item.id} productItem={item} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            Chưa có sản phẩm nào trong danh mục này.
          </div>
        )}
      </div>
    </>
  );
}

// Optional: Add metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  try {
    const categoryResponse = await categoryService.getBySlug(slug);
    if (categoryResponse.success && categoryResponse.data) {
      return {
        title: `${categoryResponse.data.name} - Apple Zone`,
        description: `Browse our collection of ${categoryResponse.data.name} products`,
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Category - Apple Zone",
    description: "Browse our product categories",
  };
}
