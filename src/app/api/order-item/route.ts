import { NextRequest, NextResponse } from "next/server";
import { orderItemService } from "@/services";
import { errorResponse } from "@/libs/api-response";
import { adminAuthMiddleware } from "@/utils/supabase/admin-middleware";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");
    const productItemId = searchParams.get("productItemId");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : 10;

    const whereClause: any = {};

    if (orderId) {
      whereClause.order_id = parseInt(orderId);
    }

    if (productItemId) {
      whereClause.product_item_id = parseInt(productItemId);
    }

    const result = await orderItemService.getAll(
      whereClause,
      {
        page,
        pageSize,
      },
      {
        product_items: true,
      }
    );

    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}

export async function POST(request: NextRequest) {
  // // Check admin rights
  // const authResponse = await adminAuthMiddleware(request);
  // if (authResponse) return authResponse;

  try {
    const body = await request.json();
    console.log("body", body);
    const result = await orderItemService.create(body);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}
