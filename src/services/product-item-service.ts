import { BaseService } from "./base-service";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { productItemInputSchema, ProductItemInputType } from "@/schemas";
import {
  successResponse,
  errorResponse,
  ApiResponse,
} from "@/libs/api-response";

class ProductItemService extends BaseService<
  ProductItemInputType,
  typeof prisma.product_items,
  Prisma.product_itemsInclude,
  Prisma.product_itemsWhereInput
> {
  constructor() {
    super(prisma.product_items, "Product item", productItemInputSchema);
  }
  async getBySlug(slug: string): Promise<ApiResponse<any>> {
    const result = await this.model.findMany({
      where: {
        slug: slug,
      },
      include: {
        products: {
          include: {
            product_items: true,
          },
        },
        stocks: {
          include: {
            product_colors: true,
          },
        },
      },
    });

    if (!result) {
      return errorResponse("Not found", 404);
    }
    return successResponse(result, "Got");
  }

  async getHomeCategoryProducts(
    categorySlug: string,
    limit: number
  ): Promise<ApiResponse<any>> {
    const result = await this.model.findMany({
      where: {
        categories: {
          categories: {
            slug: categorySlug,
          },
        },
      },
      include: {
        categories: {
          include: {
            categories: true,
          },
        },
      },
      take: limit,
    });

    if (!result) {
      return errorResponse("Not found", 404);
    }
    return successResponse(result, "Got");
  }

  async searchProducts(query: string): Promise<ApiResponse<any>> {
    const result = await this.model.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    return successResponse(result, "Search results");
  }
}

export const productItemService = new ProductItemService();
