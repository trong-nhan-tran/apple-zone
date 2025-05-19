import { NextRequest, NextResponse } from "next/server";
import { productItemService } from "@/services";
import { errorResponse } from "@/libs/api-response";
import { adminAuthMiddleware } from "@/utils/supabase/admin-middleware";
import prisma from "@/libs/prisma";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(errorResponse("ID is required", 400), {
        status: 400,
      });
    }

    const result = await productItemService.getById(id, {
      products: true,
      categories: true,
    });

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
  // Check admin rights
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(errorResponse("ID is required", 400), {
        status: 400,
      });
    }

    const body = await request.json();
    const result = await productItemService.update(id, body);

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
  // Check admin rights
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(errorResponse("ID is required", 400), {
        status: 400,
      });
    }

    const result = await productItemService.delete(id);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}
