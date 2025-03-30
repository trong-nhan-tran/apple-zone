import axios, { AxiosResponse } from "axios";

// Định nghĩa các type cho response
interface UploadResponse {
  success: boolean;
  url: string;
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  deletedCount?: number;
  error?: string;
}

class ImageService {
  // Upload nhiều file hoặc một file
  async upload(
    files: File | File[],
    folder: string = "products"
  ): Promise<string | string[]> {
    try {
      const formData = new FormData();

      // Xử lý cả trường hợp single file và multiple files
      const filesArray = Array.isArray(files) ? files : [files];
      filesArray.forEach((file) => formData.append("files", file));
      formData.append("folder", folder);

      const response: AxiosResponse<UploadResponse> = await axios.post(
        "/api/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { data } = response;

      if (!data.success) {
        throw new Error(data.error || "Upload failed");
      }

      // Trả về array URL nếu upload nhiều file, hoặc single URL nếu upload 1 file
      return Array.isArray(files) ? data.url : data.url[0];
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Unknown error during upload");
      console.error("Error uploading image(s):", err);
      throw err;
    }
  }

  // Delete một hoặc nhiều file
  async delete(paths: string | string[]): Promise<boolean> {
    try {
      const pathsArray = Array.isArray(paths) ? paths : [paths];

      if (pathsArray.length === 0) {
        throw new Error("No paths provided for deletion");
      }

      const response: AxiosResponse<DeleteResponse> = await axios.delete(
        "/api/image/delete",
        {
          data: { filePaths: pathsArray }, // Sử dụng filePaths để đồng bộ với API
        }
      );

      const { data } = response;

      if (!data.success) {
        throw new Error(data.error || "Delete failed");
      }

      return true;
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Unknown error during delete");
      console.error("Error deleting image(s):", err);
      return false;
    }
  }

  // Extract path từ URL
  extractPathFromUrl(url: string): string | null {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxx.supabase.co";
      const regex = new RegExp(
        `${baseUrl}/storage/v1/object/public/images/(.+)`
      );
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Error extracting path from URL:", error);
      return null;
    }
  }
}

export const imageService = new ImageService();
