import axios from "axios";
import { ApiResponse } from "@/libs/api-response";
import { OrderItemInputType } from "@/schemas";

class OrderItemApi {
  private API_URL = "/api/order-item";

  private getAuthHeaders() {
    return {};
  }

  async getAll(params?: {
    orderId?: string;
    productItemId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.orderId) {
      queryParams.append("orderId", params.orderId);
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

  async create(data: OrderItemInputType): Promise<ApiResponse<any>> {
    const response = await axios.post<ApiResponse<any>>(this.API_URL, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async update(
    id: string,
    data: OrderItemInputType
  ): Promise<ApiResponse<any>> {
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

  async getByOrderId(orderId: string): Promise<ApiResponse<any[]>> {
    return this.getAll({ orderId });
  }
}

export const orderItemApi = new OrderItemApi();
