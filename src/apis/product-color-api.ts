import axios from "axios";
import { ApiResponse } from "@/libs/api-response";
import { ProductColorInputType } from "@/schemas";
import { storageService } from "@/services/storage-service";

class ProductColorApi {
  private API_URL = "/api/product-color";

  private getAuthHeaders() {
    return {};
  }

  async getAll(params?: {
    keyword?: string;
    limit?: number;
    productId?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) {
      queryParams.append("keyword", params.keyword);
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.productId) {
      queryParams.append("productId", params.productId);
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
    data: ProductColorInputType,
    thumbnailFile?: File | null,
    additionalImages?: File[] | null
  ): Promise<ApiResponse<any>> {
    try {
      let thumbnailUrl = data.thumbnail;
      let imageUrls = data.images || [];

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const uploadResponse = await storageService.upload(
          thumbnailFile,
          "color-thumbnails"
        );
        if (!uploadResponse.success) {
          return uploadResponse;
        }
        thumbnailUrl = uploadResponse.data as string;
      }

      // Upload additional images if provided
      if (additionalImages && additionalImages.length > 0) {
        const uploadResponse = await storageService.upload(
          additionalImages,
          "color-images"
        );
        if (!uploadResponse.success) {
          return uploadResponse;
        }

        // If multiple files were uploaded, add all URLs to images array
        const newImageUrls = Array.isArray(uploadResponse.data)
          ? uploadResponse.data
          : [uploadResponse.data];

        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Update data with the new image URLs
      const colorData = {
        ...data,
        thumbnail: thumbnailUrl,
        images: imageUrls,
      };

      // Continue with the regular API call
      const response = await axios.post<ApiResponse<any>>(
        this.API_URL,
        colorData,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in color create:", error);
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
    data: ProductColorInputType,
    thumbnailFile?: File | null,
    oldThumbnailUrl?: string | null,
    additionalImages?: File[] | null,
    removedImageUrls?: string[] | null
  ): Promise<ApiResponse<any>> {
    try {
      let thumbnailUrl = data.thumbnail;
      let imageUrls = [...(data.images || [])];

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const uploadResponse = await storageService.upload(
          thumbnailFile,
          "color-thumbnails"
        );
        if (!uploadResponse.success) {
          return uploadResponse;
        }
        thumbnailUrl = uploadResponse.data as string;
      }

      // Upload additional images if provided
      if (additionalImages && additionalImages.length > 0) {
        const uploadResponse = await storageService.upload(
          additionalImages,
          "color-images"
        );
        if (!uploadResponse.success) {
          return uploadResponse;
        }

        // If multiple files were uploaded, add all URLs to images array
        const newImageUrls = Array.isArray(uploadResponse.data)
          ? uploadResponse.data
          : [uploadResponse.data];

        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Update data with the image URLs
      const colorData = {
        ...data,
        thumbnail: thumbnailUrl,
        images: imageUrls,
      };

      // Make the API call
      const response = await axios.put<ApiResponse<any>>(
        `${this.API_URL}/${id}`,
        colorData,
        { headers: this.getAuthHeaders() }
      );

      // Handle image cleanup if update was successful
      if (response.data.success) {
        // Delete old thumbnail if it was replaced
        if (oldThumbnailUrl && oldThumbnailUrl !== thumbnailUrl) {
          try {
            const extractResponse =
              storageService.extractPathFromUrl(oldThumbnailUrl);
            if (extractResponse.success && extractResponse.data) {
              await storageService.delete(extractResponse.data);
            }
          } catch (deleteError) {
            console.error("Error deleting old thumbnail:", deleteError);
          }
        }

        // Delete removed images if any
        if (removedImageUrls && removedImageUrls.length > 0) {
          try {
            for (const imageUrl of removedImageUrls) {
              const extractResponse =
                storageService.extractPathFromUrl(imageUrl);
              if (extractResponse.success && extractResponse.data) {
                await storageService.delete(extractResponse.data);
              }
            }
          } catch (deleteError) {
            console.error("Error deleting removed images:", deleteError);
          }
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error in color update:", error);
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
      // Lấy thông tin màu sắc trước khi xóa để biết URL ảnh
      const colorResponse = await this.getById(id);
      const colorData = colorResponse.success ? colorResponse.data : null;

      // Xóa màu sắc từ database
      const response = await axios.delete<ApiResponse<any>>(
        `${this.API_URL}/${id}`,
        { headers: this.getAuthHeaders() }
      );

      // Nếu xóa thành công và có dữ liệu ảnh, xóa các ảnh liên quan
      if (response.data.success && colorData) {
        try {
          // Xóa thumbnail
          if (colorData.thumbnail) {
            const extractResponse = storageService.extractPathFromUrl(
              colorData.thumbnail
            );
            if (extractResponse.success && extractResponse.data) {
              await storageService.delete(extractResponse.data);
            }
          }

          // Xóa các ảnh bổ sung
          if (colorData.images && colorData.images.length > 0) {
            for (const imageUrl of colorData.images) {
              const extractResponse =
                storageService.extractPathFromUrl(imageUrl);
              if (extractResponse.success && extractResponse.data) {
                await storageService.delete(extractResponse.data);
              }
            }
          }
        } catch (deleteError) {
          console.error("Error deleting color images:", deleteError);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error in color delete:", error);
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

export const productColorApi = new ProductColorApi();
