import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/services";
import { errorResponse } from "@/libs/api-response";

export async function GET(request: NextRequest) {
  try {
    const result = await categoryService.getAllChildren();
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    const response = errorResponse("Server error", 500, error);
    return NextResponse.json(response, { status: response.status });
  }
}
