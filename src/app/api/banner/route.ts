import { apiSuccess, handleApiError } from "@/lib/api-response";
import prisma from "@/lib/prisma";
import { bannerImageSchema } from "@/types/schema";
import { NextRequest } from "next/server";

// GET all banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug");

    const whereClause = categorySlug
      ? {
          categories: {
            slug: categorySlug,
          },
        }
      : {};

    const banners = await prisma.banner_images.findMany({
      where: whereClause,
      include: {
        categories: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return apiSuccess(banners);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST new banner
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = bannerImageSchema.parse(body);

    // Check if category exists when category_id is provided
    if (validatedData.category_id) {
      const categoryExists = await prisma.categories.findUnique({
        where: { id: validatedData.category_id },
      });

      if (!categoryExists) {
        throw {
          name: "ValidationError",
          message: "Danh mục không tồn tại",
          code: "CATEGORY_NOT_FOUND",
        };
      }
    }

    // Create banner
    const banner = await prisma.banner_images.create({
      data: {
        url: validatedData.url,
        category_id: validatedData.category_id,
        direct_link: validatedData.direct_link,
      },
      include: {
        categories: true,
      },
    });

    return apiSuccess(banner, "Tạo banner thành công", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
