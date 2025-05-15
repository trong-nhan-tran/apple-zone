import { BaseService } from "./base-service";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { categoryInputSchema, CategoryInputType } from "@/schemas";
import {
  successResponse,
  errorResponse,
  ApiResponse,
} from "@/libs/api-response";

class CategoryService extends BaseService<
  CategoryInputType,
  typeof prisma.categories,
  Prisma.categoriesInclude,
  Prisma.categoriesWhereInput
> {
  constructor() {
    super(prisma.categories, "Category", categoryInputSchema);
  }

  // Lấy tất cả danh mục cha (không có parent_id)
  async getAllParents(): Promise<ApiResponse<any>> {
    const result = await this.model.findMany({
      where: {
        parent_id: null,
      },
    });

    if (!result) {
      return errorResponse("No category parent found", 404);
    }
    return successResponse(result, "Got all category parents");
  }

  // Lấy tất cả danh mục con (có parent_id)
  async getAllChildren(): Promise<ApiResponse<any>> {
    const result = await this.model.findMany({
      where: {
        NOT: {
          parent_id: null,
        },
      },
      include: {
        categories: true,
      },
    });

    if (!result) {
      return errorResponse("No children categories found", 404);
    }
    return successResponse(result, "Got all children categories");
  }

  // Lấy cây danh mục (phân cấp)
  async getCategoryTree(): Promise<ApiResponse<any>> {
    try {
      // 1. Lấy tất cả danh mục
      const allCategories = await this.model.findMany({
        include: {
          categories: true,
        },
      });

      // 2. Tạo map danh mục cha
      const parentMap = new Map();
      allCategories.forEach((cat) => {
        if (!cat.parent_id) {
          parentMap.set(cat.id, {
            ...cat,
            children: [],
          });
        }
      });

      // 3. Thêm các danh mục con vào danh mục cha
      allCategories.forEach((cat) => {
        if (cat.parent_id && parentMap.has(cat.parent_id)) {
          const parent = parentMap.get(cat.parent_id);
          parent.children.push(cat);
        }
      });

      // 4. Chuyển Map thành mảng kết quả
      const result = Array.from(parentMap.values());

      return successResponse(result, "Category tree retrieved successfully");
    } catch (error) {
      console.error("Error retrieving category tree:", error);
      return errorResponse("Failed to retrieve category tree", 500, error);
    }
  }

  async getBySlug(slug: string): Promise<ApiResponse<any>> {
    const result = await this.model.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!result) {
      return errorResponse("Category not found", 404);
    }
    return successResponse(result, "Category retrieved successfully");
  }
}

export const categoryService = new CategoryService();
