import axios from "axios";
import { ProductItemType } from "@/types/schema";
import { ApiResponse } from "@/lib/api-response";

class ProductItemService {
  private baseUrl = "/api/product-item";

  async getAll(params?: {
    subcategorySlug?: string;
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
      if (params?.subcategorySlug) {
        queryParams.append("subcategorySlug", params.subcategorySlug);
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
      console.log("Error fetching product items:", error);
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

  async getBySlug(slug: string): Promise<ApiResponse> {
    try {
      const response = await axios.get<ApiResponse>(
        `${this.baseUrl}/slug?slug=${encodeURIComponent(slug)}`
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

  async create(data: ProductItemType): Promise<ApiResponse> {
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

  async update(id: string, data: ProductItemType): Promise<ApiResponse> {
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

  async delete(id: string): Promise<ApiResponse> {
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

export const productItemService = new ProductItemService();
