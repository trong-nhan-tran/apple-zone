import axios from "axios";
import { ApiResponse } from "@/libs/api-response";
import { ProductInputType } from "@/schemas/product-shema";
import { storageService } from "@/services/storage-service";

class ProductApi {
  private API_URL = "/api/product";

  private getAuthHeaders() {
    return {};
  }

  async getAll(params?: {
    categorySlug?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();

    if (params?.categorySlug) {
      queryParams.append("categorySlug", params.categorySlug);
    }
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

  async create(
    data: ProductInputType,
    thumbnailFile?: File | null
  ): Promise<ApiResponse<any>> {
    try {
      // Handle thumbnail upload if provided
      if (thumbnailFile) {
        const uploadResponse = await storageService.upload(
          thumbnailFile,
          "thumbnails"
        );
        if (!uploadResponse.success) {
          return uploadResponse; // Return the error response
        }

        // Update data with the new thumbnail URL
        data = {
          ...data,
          thumbnail: uploadResponse.data,
        };
      }

      // Continue with the regular API call
      const response = await axios.post<ApiResponse<any>>(this.API_URL, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error in product create:", error);
      if (axios.isAxiosError(error)) {
        return (
          error.response?.data || {
            success: false,
            data: null,
            message: "Network error",
            status: 500,
          }
        );
      }
      return {
        success: false,
        data: null,
        message: "Unknown error occurred",
        status: 500,
      };
    }
  }

  async update(
    id: string,
    data: ProductInputType,
    thumbnailFile?: File | null,
    oldThumbnailUrl?: string | null
  ): Promise<ApiResponse<any>> {
    try {
      let thumbnailUrl = data.thumbnail;

      // Handle thumbnail upload if provided
      if (thumbnailFile) {
        const uploadResponse = await storageService.upload(
          thumbnailFile,
          "thumbnails"
        );
        if (!uploadResponse.success) {
          return uploadResponse; // Return the error response
        }

        thumbnailUrl = uploadResponse.data;
      }

      // Update data with the thumbnail URL
      const productData = {
        ...data,
        thumbnail: thumbnailUrl,
      };

      // Make the API call
      const response = await axios.put<ApiResponse<any>>(
        `${this.API_URL}/${id}`,
        productData,
        { headers: this.getAuthHeaders() }
      );

      // Delete old thumbnail if it was replaced successfully
      if (
        response.data.success &&
        oldThumbnailUrl &&
        oldThumbnailUrl !== thumbnailUrl
      ) {
        try {
          const extractResponse =
            storageService.extractPathFromUrl(oldThumbnailUrl);
          if (extractResponse.success && extractResponse.data) {
            await storageService.delete(extractResponse.data);
          }
        } catch (deleteError) {
          console.error("Error deleting old thumbnail:", deleteError);
          // Continue with the update even if thumbnail deletion fails
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error in product update:", error);
      if (axios.isAxiosError(error)) {
        return (
          error.response?.data || {
            success: false,
            data: null,
            message: "Network error",
            status: 500,
          }
        );
      }
      return {
        success: false,
        data: null,
        message: "Unknown error occurred",
        status: 500,
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<any>> {
    try {
      // Bước 1: Lấy thông tin sản phẩm trước khi xóa để biết đường dẫn thumbnail
      const productResponse = await this.getById(id);
      const productThumbnail = productResponse.success
        ? productResponse.data?.thumbnail
        : null;

      // Bước 2: Gọi API để xóa sản phẩm
      const response = await axios.delete<ApiResponse<any>>(
        `${this.API_URL}/${id}`,
        { headers: this.getAuthHeaders() }
      );

      // Bước 3: Nếu xóa sản phẩm thành công và có thumbnail, xóa thumbnail
      if (response.data.success && productThumbnail) {
        try {
          const extractResponse =
            storageService.extractPathFromUrl(productThumbnail);
          if (extractResponse.success && extractResponse.data) {
            await storageService.delete(extractResponse.data);
            console.log("Successfully deleted thumbnail:", productThumbnail);
          }
        } catch (deleteError) {
          console.error(
            "Error deleting thumbnail after product deletion:",
            deleteError
          );
          // Continue with the response even if thumbnail deletion fails
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error in product delete:", error);
      if (axios.isAxiosError(error)) {
        return (
          error.response?.data || {
            success: false,
            data: null,
            message: "Network error",
            status: 500,
          }
        );
      }
      return {
        success: false,
        data: null,
        message: "Unknown error occurred",
        status: 500,
      };
    }
  }
}

export const productApi = new ProductApi();
