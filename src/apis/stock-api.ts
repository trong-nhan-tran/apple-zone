import axios from "axios";
import { ApiResponse } from "@/libs/api-response";
import { StockInputType } from "@/schemas";

class StockApi {
  private API_URL = "/api/stock";

  private getAuthHeaders() {
    return {};
  }

  async getAll(params?: {
    keyword?: string;
    productItemId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) {
      queryParams.append("keyword", params.keyword);
    }
    if (params?.productItemId) {
      queryParams.append("productItemId", params.productItemId);
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

  async create(data: StockInputType): Promise<ApiResponse<any>> {
    const response = await axios.post<ApiResponse<any>>(this.API_URL, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async update(id: string, data: StockInputType): Promise<ApiResponse<any>> {
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
}

export const stockApi = new StockApi();
