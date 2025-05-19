import { NextRequest, NextResponse } from "next/server";
import { stockService } from "@/services";
import { errorResponse } from "@/libs/api-response";
import { adminAuthMiddleware } from "@/utils/supabase/admin-middleware";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productItemId = searchParams.get("productItemId");
    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : 10;

    const whereClause: any = {};
    if (productItemId) {
      whereClause.product_item_id = parseInt(productItemId);
    }

    if (keyword && keyword.trim() !== "") {
      whereClause.name = {
        contains: keyword.trim(),
        mode: "insensitive",
      };
    }

    // Pass the pagination parameters to the service
    const result = await stockService.getAll(
      whereClause,
      {
        page,
        pageSize,
      },
      {
        product_colors: true,
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
    console.log("body", body);
    const result = await stockService.create(body);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    console.log("Error in POST /api/stock", error);
    return NextResponse.json(response, { status: response.status });
  }
}
