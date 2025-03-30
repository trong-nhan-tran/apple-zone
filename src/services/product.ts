import axios from "axios";
import { ProductType } from "@/types/schema";
import { ApiResponse } from "@/lib/api-response";

class ProductService {
  private baseUrl = "/api/product";

  async getAll(params?: {
    categorySlug?: string;
    keyword?: string;
    limit?: number;
  }): Promise<ApiResponse> {
    try {
      let url = this.baseUrl;
      const queryParams = new URLSearchParams();

      if (params?.categorySlug) {
        queryParams.append("categorySlug", params.categorySlug);
      }

      if (params?.keyword) {
        queryParams.append("keyword", params.keyword);
      }
      if (params?.limit) {
        queryParams.append("limit", params.limit.toString());
      }
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await axios.get<ApiResponse>(url);
      return response.data;
    } catch (error: any) {
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }

  async getById(id: string | number): Promise<ApiResponse> {
    try {
      const response = await axios.get<ApiResponse>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }

  async create(data: ProductType): Promise<ApiResponse> {
    try {
      const response = await axios.post<ApiResponse>(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }

  async update(id: string | number, data: ProductType): Promise<ApiResponse> {
    try {
      const response = await axios.put<ApiResponse>(
        `${this.baseUrl}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        err: true,
        mess: "Không thể kết nối đến máy chủ",
        error: {
          detail: error,
        },
      };
    }
  }

  async delete(id: string | number): Promise<ApiResponse> {
    try {
      const response = await axios.delete<ApiResponse>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
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

export const productService = new ProductService();
