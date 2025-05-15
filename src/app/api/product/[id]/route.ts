import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product-service";
import { errorResponse } from "@/libs/api-response";
import { adminAuthMiddleware } from "@/middlewares/admin-middleware";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(errorResponse("ID is required", 400), {
        status: 400,
      });
    }
    const result = await productService.getById(id);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Kiểm tra quyền admin
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(errorResponse("ID is required", 400), {
        status: 400,
      });
    }
    const body = await request.json();
    const result = await productService.update(id, body);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Kiểm tra quyền admin
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(errorResponse("ID is required", 400), {
        status: 400,
      });
    }
    const result = await productService.delete(id);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}
