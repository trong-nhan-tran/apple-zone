/**
 * Định nghĩa cấu trúc response chuẩn cho toàn bộ ứng dụng
 */
export interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  status: number;
  error?: any;
  pagination?: PaginationData | null;
}

/**
 * Helper function để tạo response thành công
 */
export function successResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200,
  pagination?: PaginationData | null
): ApiResponse<T> {
  return {
    success: true,
    data,
    pagination: pagination || null,
    message,
    status,
    error: null,
  };
}

/**
 * Helper function để tạo response lỗi
 */
export function errorResponse(
  message: string = "Error",
  status: number = 400,
  error: any = null
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    message,
    status,
    error,
  };
}
