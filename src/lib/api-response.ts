import { NextResponse } from "next/server";

export type ApiSuccessResponse = {
  err: false;
  data: any;
  mess: string;
};

export type ApiErrorResponse = {
  err: true;
  mess: string;
  error?: {
    code?: string;
    detail?: any;
  };
};

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

/**
 * Returns a standardized success response
 * @param data The data to include in the response
 * @param mess Success message
 * @param status The HTTP status code (default: 200)
 */
export function apiSuccess<T>(
  data: T,
  mess = "Thành công",
  status = 200
): NextResponse {
  return NextResponse.json(
    {
      err: false,
      data,
      mess,
    },
    { status }
  );
}

/**
 * Returns a standardized error response
 * @param mess User-friendly error message
 * @param status HTTP status code (default: 500)
 * @param code Optional error code for frontend handling
 * @param detail Optional detailed error information (for debugging)
 */
export function apiError(
  mess: string,
  status = 500,
  code?: string,
  detail?: any
): NextResponse {
  return NextResponse.json(
    {
      err: true,
      mess,
      error: code || detail ? { code, detail } : undefined,
    },
    { status }
  );
}

/**
 * Common error handler for API routes
 * Automatically detects common error types and returns appropriate responses
 */
export function handleApiError(error: any): NextResponse {
  console.error("API Error:", error);

  // Handle Prisma errors
  if (error?.code === "P2002") {
    return apiError(
      "Dữ liệu với thông tin này đã tồn tại",
      409,
      "UNIQUE_CONSTRAINT",
      error
    );
  }

  // Handle validation errors (Zod)
  if (error?.name === "ZodError") {
    return apiError(
      "Dữ liệu không hợp lệ",
      400,
      "VALIDATION_ERROR",
      error.errors
    );
  }

  // Handle validation errors (other)
  if (error?.name === "ValidationError") {
    return apiError(
      error.message || "Dữ liệu không hợp lệ",
      400,
      "VALIDATION_ERROR",
      error
    );
  }

  // Generic error
  return apiError(error?.message || "Lỗi máy chủ", 500, "SERVER_ERROR");
}
