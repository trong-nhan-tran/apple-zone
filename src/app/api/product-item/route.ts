import { apiSuccess, handleApiError } from "@/lib/api-response";
import prisma from "@/lib/prisma";
import { productItemSchema } from "@/types/schema";
import { NextRequest } from "next/server";

// GET all product items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subcategorySlug = searchParams.get("subcategorySlug");
    const categorySlug = searchParams.get("categorySlug");
    const keyword = searchParams.get("keyword")?.toLowerCase().trim();
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    // Xây dựng query
    const whereClause: any = {};

    // Cách 1: Truy vấn theo subcategory (chi tiết hơn)
    if (subcategorySlug) {
      whereClause.subcategories = {
        slug: subcategorySlug,
      };
    }
    // Cách 2: Truy vấn theo category (cấp cao hơn - bao gồm nhiều subcategory)
    else if (categorySlug) {
      whereClause.subcategories = {
        categories: {
          slug: categorySlug,
        },
      };
    }

    // Tìm kiếm theo từ khóa
    if (keyword) {
      whereClause.name = {
        contains: keyword,
        mode: "insensitive", // Tìm kiếm không phân biệt chữ hoa-thường
      };
    }

    const productItems = await prisma.product_items.findMany({
      where: whereClause,
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
      take: limit, // Giới hạn số lượng kết quả trả về
    });

    return apiSuccess(productItems);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST new product item
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input data
    const validatedData = productItemSchema.parse(body);

    // Check if product item with same name or slug already exists
    const existingProductItem = await prisma.product_items.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug: validatedData.slug }],
      },
    });

    if (existingProductItem) {
      throw {
        name: "ValidationError",
        message: "Sản phẩm với tên hoặc slug này đã tồn tại",
        code: "DUPLICATE_PRODUCT_ITEM",
      };
    }

    // Create new product item
    const productItem = await prisma.product_items.create({
      data: {
        name: validatedData.name,
        thumbnail: validatedData.thumbnail || null,
        price: validatedData.price,
        slug: validatedData.slug,
        product_id: validatedData.product_id || null,
        subcategory_id: validatedData.subcategory_id || null,
        option_name: validatedData.option_name || null,
        option_value: validatedData.option_value || null,
      },
      include: {
        products: true,
        subcategories: true,
      },
    });

    return apiSuccess(productItem, "Thêm sản phẩm thành công", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
