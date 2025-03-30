import axios from "axios";
import { CategoryType } from "@/types/schema";
import { ApiResponse } from "@/lib/api-response";

class CategoryService {
  private baseUrl = "/api/category";

  async getAll(): Promise<ApiResponse> {
    try {
      const response = await axios.get<ApiResponse>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      // If the server is down or network error, create a client-side error response
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }

  async getById(id: string): Promise<ApiResponse> {
    try {
      const response = await axios.get<ApiResponse>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        // Server responded with an error
        return error.response.data;
      }
      // Network or other client-side error
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }

  async create(data: CategoryType): Promise<ApiResponse> {
    try {
      const response = await axios.post<ApiResponse>(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        // Server responded with an error
        return error.response.data;
      }
      // Network or other client-side error
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }

  async update(id: string, data: CategoryType): Promise<ApiResponse> {
    try {
      const response = await axios.put<ApiResponse>(
        `${this.baseUrl}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        // Server responded with an error
        return error.response.data;
      }
      // Network or other client-side error
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }

  async delete(id: string): Promise<ApiResponse> {
    try {
      const response = await axios.delete<ApiResponse>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        // Server responded with an error
        return error.response.data;
      }
      // Network or other client-side error
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }
}

export const categoryService = new CategoryService();
