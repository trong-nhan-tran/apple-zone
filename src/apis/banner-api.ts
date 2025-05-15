import axios from "axios";
import { ApiResponse } from "@/libs/api-response";
import { BannerInputType } from "@/schemas";
import { storageService } from "@/services/storage-service";

class BannerApi {
  private API_URL = "/api/banner";

  private getAuthHeaders() {
    return {};
  }

  async getAll(params?: {
    keyword?: string;
    page?: number;
    pageSize?: number;
    categoryId?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) {
      queryParams.append("keyword", params.keyword);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.categoryId) {
      queryParams.append("categoryId", params.categoryId);
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
    data: BannerInputType,
    bannerFile?: File | null
  ): Promise<ApiResponse<any>> {
    try {
      // Handle banner image upload if provided
      if (bannerFile) {
        const uploadResponse = await storageService.upload(
          bannerFile,
          "banners"
        );
        if (!uploadResponse.success) {
          return uploadResponse; // Return the error response
        }

        // Update data with the new image URL
        data = {
          ...data,
          url: uploadResponse.data,
        };
      }

      // Continue with the regular API call
      const response = await axios.post<ApiResponse<any>>(this.API_URL, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error in banner create:", error);
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
    data: BannerInputType,
    bannerFile?: File | null,
    oldBannerUrl?: string | null
  ): Promise<ApiResponse<any>> {
    try {
      let bannerUrl = data.url;

      // Handle banner upload if provided
      if (bannerFile) {
        const uploadResponse = await storageService.upload(
          bannerFile,
          "banners"
        );
        if (!uploadResponse.success) {
          return uploadResponse; // Return the error response
        }

        bannerUrl = uploadResponse.data;
      }

      // Update data with the image URL
      const bannerData = {
        ...data,
        url: bannerUrl,
      };

      // Make the API call
      const response = await axios.put<ApiResponse<any>>(
        `${this.API_URL}/${id}`,
        bannerData,
        { headers: this.getAuthHeaders() }
      );

      // Delete old banner if it was replaced successfully
      if (response.data.success && oldBannerUrl && oldBannerUrl !== bannerUrl) {
        try {
          const extractResponse =
            storageService.extractPathFromUrl(oldBannerUrl);
          if (extractResponse.success && extractResponse.data) {
            await storageService.delete(extractResponse.data);
          }
        } catch (deleteError) {
          console.error("Error deleting old banner:", deleteError);
          // Continue with the update even if banner deletion fails
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error in banner update:", error);
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
      // Bước 1: Lấy thông tin banner trước khi xóa để biết đường dẫn hình ảnh
      const bannerResponse = await this.getById(id);
      const bannerUrl = bannerResponse.success
        ? bannerResponse.data?.url
        : null;

      // Bước 2: Gọi API để xóa banner
      const response = await axios.delete<ApiResponse<any>>(
        `${this.API_URL}/${id}`,
        { headers: this.getAuthHeaders() }
      );

      // Bước 3: Nếu xóa banner thành công và có hình ảnh, xóa hình ảnh
      if (response.data.success && bannerUrl) {
        try {
          const extractResponse = storageService.extractPathFromUrl(bannerUrl);
          if (extractResponse.success && extractResponse.data) {
            await storageService.delete(extractResponse.data);
            console.log("Successfully deleted banner image:", bannerUrl);
          }
        } catch (deleteError) {
          console.error(
            "Error deleting banner image after deletion:",
            deleteError
          );
          // Continue with the response even if image deletion fails
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error in banner delete:", error);
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

export const bannerApi = new BannerApi();
