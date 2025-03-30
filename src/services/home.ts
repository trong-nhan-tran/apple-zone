import prisma from "@/lib/prisma";
import { ProductItemType } from "@/types/schema";

// Map category name từ UI tới category slug trong database
const categoryToSlugMap: Record<string, string> = {
  "iPhone": "iphone",
  "Mac": "mac",
  "iPad": "ipad",
  "Watch": "watch",
  "Tai nghe": "tai-nghe",
  "Phụ kiện": "phu-kien",
};

/**
 * Lấy sản phẩm theo category cho trang home - truy vấn trực tiếp Prisma
 */
export async function getHomeCategoryProducts(
  category: string,
  limit: number = 14
): Promise<ProductItemType[]|any[]> {
  try {
    const slug = categoryToSlugMap[category];
    console.log("Fetching category:", category, "-> Slug:", slug);

    if (!slug) {
      console.error(`No slug mapping found for category: ${category}`);
      return [];
    }

    // Truy vấn trực tiếp Prisma
    const productItems = await prisma.product_items.findMany({
      where: {
        subcategories: {
          categories: {
            slug: slug,
          },
        },
      },
      include: {
        subcategories: {
          include: {
            categories: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    });

    console.log(`Found ${productItems.length} products for ${category}`);
    return productItems;
  } catch (error) {
    console.error(`Failed to fetch ${category} products:`, error);
    return [];
  }
}
