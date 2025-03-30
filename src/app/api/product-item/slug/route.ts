import { apiSuccess, handleApiError } from "@/lib/api-response";
import prisma from "@/lib/prisma";

// GET product item by slug
export async function GET(request: Request) {
  try {
    // Get slug from URL search params
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      throw {
        name: "ValidationError",
        message: "Thiếu tham số slug",
        code: "MISSING_SLUG",
      };
    }

    const productItem = await prisma.product_items.findFirst({
      where: { slug },
      include: {
        products: {
          include: {
            product_items: true,
            product_color_images: {
              include: {
                colors: true,
              },
            },
          },
        },
        subcategories: true,
      },
    });

    if (!productItem) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy sản phẩm",
        code: "PRODUCT_ITEM_NOT_FOUND",
      };
    }

    return apiSuccess(productItem);
  } catch (error) {
    return handleApiError(error);
  }
}
