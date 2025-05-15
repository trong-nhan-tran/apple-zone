import axios from "axios";
import { ApiResponse } from "@/libs/api-response";
import { CategoryInputType } from "@/schemas";

class CategoryApi {
  private API_URL = "/api/category";

  private getAuthHeaders() {
    return {};
  }

  async getAll(params?: {
    keyword?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) {
      queryParams.append("keyword", params.keyword);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.pageSize) {
      queryParams.append("pageSize", params.pageSize.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${this.API_URL}?${queryString}` : this.API_URL;

    const response = await axios.get<ApiResponse<any[]>>(url);
    return response.data;
  }

  async getById(id: string): Promise<ApiResponse<any>> {
    const response = await axios.get<ApiResponse<any>>(`${this.API_URL}/${id}`);
    return response.data;
  }

  async create(data: CategoryInputType): Promise<ApiResponse<any>> {
    const response = await axios.post<ApiResponse<any>>(this.API_URL, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async update(id: string, data: CategoryInputType): Promise<ApiResponse<any>> {
    const response = await axios.put<ApiResponse<any>>(
      `${this.API_URL}/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse<any>> {
    const response = await axios.delete<ApiResponse<any>>(
      `${this.API_URL}/${id}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async getAllParents(): Promise<ApiResponse<any[]>> {
    const response = await axios.get<ApiResponse<any[]>>(
      `${this.API_URL}/parent`
    );
    return response.data;
  }

  async getAllChildren(): Promise<ApiResponse<any[]>> {
    const response = await axios.get<ApiResponse<any[]>>(
      `${this.API_URL}/children`
    );
    return response.data;
  }

  async getCategoryTree(): Promise<ApiResponse<any[]>> {
    const response = await axios.get<ApiResponse<any[]>>(
      `${this.API_URL}/tree`
    );
    return response.data;
  }
}

export const categoryApi = new CategoryApi();
