import axios from "axios";
import { ColorType } from "@/types/schema";
import { ApiResponse } from "@/lib/api-response";

class ColorService {
  private baseUrl = "/api/color";

  async getAll(): Promise<ApiResponse> {
    try {
      const response = await axios.get<ApiResponse>(this.baseUrl);
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

  async create(data: ColorType): Promise<ApiResponse> {
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

  async update(id: string, data: ColorType): Promise<ApiResponse> {
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

export const colorService = new ColorService();
