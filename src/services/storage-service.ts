import { supabase } from "@/libs/supabase";
import {
  ApiResponse,
  successResponse,
  errorResponse,
} from "@/libs/api-response";

class StorageService {
  // Upload nhiều file hoặc một file
  async upload(
    files: File | File[],
    folder: string = "products"
  ): Promise<ApiResponse<string | string[] | any>> {
    try {
      const filesArray = Array.isArray(files) ? files : [files];

      const uploadResults = await Promise.all(
        filesArray.map(async (file) => {
          // Lấy thời gian hiện tại
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          const seconds = String(now.getSeconds()).padStart(2, "0");

          // Lấy tên file gốc và loại bỏ extension
          const originalName = file.name.split(".").slice(0, -1).join(".");

          // Loại bỏ ký tự đặc biệt, dấu cách từ tên file gốc
          const sanitizedName = originalName
            .replace(/[^\w\s]/gi, "") // Loại bỏ ký tự đặc biệt
            .replace(/\s+/g, "-") // Thay thế dấu cách bằng dấu gạch ngang
            .toLowerCase();

          // Tạo tên file mới có ý nghĩa
          const fileName = `${year}${month}${day}-${hours}${minutes}${seconds}-${sanitizedName}`;

          // Lấy phần mở rộng của file
          const fileExt = file.name.split(".").pop();

          // Đường dẫn đầy đủ của file
          const filePath = `${folder}/${fileName}.${fileExt}`;

          const buffer = Buffer.from(await file.arrayBuffer());

          const { error } = await supabase.storage
            .from("images")
            .upload(filePath, buffer, {
              contentType: file.type,
              cacheControl: "3600",
              upsert: false,
            });

          if (error) throw error;

          const {
            data: { publicUrl },
          } = supabase.storage.from("images").getPublicUrl(filePath);

          return publicUrl;
        })
      );

      // Trả về array URL nếu upload nhiều file, hoặc single URL nếu upload 1 file
      const result = Array.isArray(files) ? uploadResults : uploadResults[0];
      return successResponse(result, "File(s) uploaded successfully", 200);
    } catch (error) {
      return errorResponse("Failed to upload file(s)", 500, error);
    }
  }

  // Delete một hoặc nhiều file
  async delete(paths: string | string[]): Promise<ApiResponse<boolean | any>> {
    try {
      const pathsArray = Array.isArray(paths) ? paths : [paths];

      if (pathsArray.length === 0) {
        return errorResponse("No paths provided for deletion", 400);
      }

      // Paths đã được trích xuất (không phải URLs đầy đủ)
      const { error } = await supabase.storage
        .from("images")
        .remove(pathsArray);

      if (error) throw error;

      return successResponse(true, "File(s) deleted successfully", 200);
    } catch (error) {
      return errorResponse("Failed to delete file(s)", 500, error);
    }
  }

  // Extract path từ URL - giữ nguyên phương thức này nhưng thêm định dạng response
  extractPathFromUrl(url: string): ApiResponse<string | null> {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxx.supabase.co";
      const regex = new RegExp(
        `${baseUrl}/storage/v1/object/public/images/(.+)`
      );
      const match = url.match(regex);
      const result = match ? match[1] : null;

      if (!result) {
        return errorResponse("Failed to extract path from URL", 400);
      }

      return successResponse(result, "Path extracted successfully", 200);
    } catch (error) {
      return errorResponse("Error extracting path from URL", 500, error);
    }
  }
}

export const storageService = new StorageService();
