import { NextRequest, NextResponse } from "next/server";
import { bannerService } from "@/services";
import { errorResponse } from "@/libs/api-response";
import { adminAuthMiddleware } from "@/middlewares/admin-middleware";

export async function GET(request: NextRequest) {
  // GET doesn't require admin rights
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("categorySlug");

    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : 10;

    const whereClause: any = {};

    // Tìm kiếm theo keyword (tên danh mục hoặc link chuyển hướng)
    if (keyword && keyword.trim() !== "") {
      whereClause.OR = [
        {
          // Tìm theo tên danh mục
          categories: {
            name: {
              contains: keyword.trim(),
              mode: "insensitive",
            },
          },
        },
        {
          // Tìm theo link chuyển hướng
          direct_link: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Lọc theo categorySlug nếu có
    if (categorySlug) {
      // Nếu đã có điều kiện OR từ keyword
      if (whereClause.OR) {
        // Thêm điều kiện categorySlug vào mỗi phần tử của OR
        whereClause.OR.forEach((condition: any) => {
          if (condition.categories) {
            condition.categories.slug = categorySlug;
          } else {
            condition.categories = { slug: categorySlug };
          }
        });
      } else {
        // Nếu chưa có điều kiện OR, tạo điều kiện categories.slug trực tiếp
        whereClause.categories = {
          slug: categorySlug,
        };
      }
    }

    const result = await bannerService.getAll(
      whereClause,
      {
        page,
        pageSize,
      },
      {
        categories: true,
      }
    );
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}

export async function POST(request: NextRequest) {
  // Check admin rights
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const result = await bannerService.create(body);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}
