import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services";
import { errorResponse } from "@/libs/api-response";
import { adminAuthMiddleware } from "@/utils/supabase/admin-middleware";

export async function GET(request: NextRequest) {
  // GET không cần quyền admin
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("categorySlug");
    const keyword = searchParams.get("keyword")?.toLowerCase().trim();
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : 10;

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
    const result = await productService.getAll(
      whereClause,
      {
        page,
        pageSize,
      },
      { categories: true, product_colors: true }
    );
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}

export async function POST(request: NextRequest) {
  // Kiểm tra quyền admin
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const result = await productService.create(body);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}
