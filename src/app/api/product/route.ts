import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/types/schema";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug");
    const keyword = searchParams.get("keyword")?.toLowerCase().trim();
        const limit = searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined;


    // Build query
    const whereClause: any = {};

    if (categorySlug) {
      whereClause.categories = {
        slug: categorySlug,
      };
    }

    if (keyword) {
      whereClause.name = {
        contains: keyword,
        mode: "insensitive",
      };
    }

    const products = await prisma.products.findMany({
      where: whereClause,
      include: {
        categories: true,
        product_color_images: {
          include: {
            colors: true,
          },
        },
        product_items: true,
      },
      take: limit, // Add limit to the query
    });

    return apiSuccess(products);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body against the schema
    const validationResult = productSchema.safeParse(body);

    if (!validationResult.success) {
      throw {
        name: "ValidationError",
        message: "Dữ liệu sản phẩm không hợp lệ",
        code: "VALIDATION_ERROR",
        detail: validationResult.error.format(),
      };
    }

    const productData = validationResult.data;
    const product = await prisma.products.findFirst({
      where: {
        name: productData.name,
      },
    });

    if (product) {
      throw {
        name: "ValidationError",
        message: "Tên sản phẩm đã tồn tại",
        code: "DUPLICATE_PRODUCT",
      };
    }

    const newProduct = await prisma.products.create({
      data: {
        name: productData.name,
        thumbnail: productData.thumbnail,
        category_id: productData.category_id,
      },
    });

    if (
      productData.product_color_images &&
      productData.product_color_images.length > 0
    ) {
      for (const item of productData.product_color_images) {
        await prisma.product_color_images.create({
          data: {
            urls: item.urls || [],
            color_id: item.color_id,
            product_id: newProduct.id,
          },
        });
      }
    }

    return apiSuccess(newProduct, "Thêm sản phẩm thành công", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
