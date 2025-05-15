import { NextRequest, NextResponse } from "next/server";
import { productColorService } from "@/services";
import { errorResponse } from "@/libs/api-response";
import { adminAuthMiddleware } from "@/middlewares/admin-middleware";

export async function GET(request: NextRequest) {
  // GET doesn't require admin rights
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    const whereClause: any = {};
    if (productId) {
      whereClause.product_id = parseInt(productId);
    }

    const result = await productColorService.getAll(whereClause, {}, {});
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

    const result = await productColorService.create(body);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}
