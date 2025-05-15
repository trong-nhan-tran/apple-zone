import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services";
import { errorResponse } from "@/libs/api-response";
import { adminAuthMiddleware } from "@/middlewares/admin-middleware";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : 10;

    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }

    if (keyword && keyword.trim() !== "") {
      whereClause.OR = [
        {
          customer_name: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        },
        {
          customer_phone: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        },
        {
          customer_email: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        }
      ];
    }

    const result = await orderService.getAll(whereClause, {
      page,
      pageSize,
    }, { 
      order_items: {
        include: {
          product_items: true
        }
      }
    });

    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await orderService.create(body);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}