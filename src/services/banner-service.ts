import { BaseService } from "./base-service";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { bannerInputSchema, BannerInputType } from "@/schemas";
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from "@/libs/api-response";

class BannerService extends BaseService<
  BannerInputType,
  typeof prisma.banners,
  Prisma.bannersInclude,
  Prisma.bannersWhereInput
> {
  constructor() {
    super(prisma.banners, "Banner", bannerInputSchema);
  }

  async getHomeBanners(): Promise<ApiResponse<any>> {
    const result = await this.model.findMany({
      where: {
        categories: {
          slug: "home",
        },
      },
    });

    if (!result) {
      return errorResponse("Not found", 404);
    }
    return successResponse(result, "Got");
  }

  async getByCategory(categorySlug: string): Promise<ApiResponse<any>> {
    const result = await this.model.findMany({
      where: {
        categories: {
          slug: categorySlug,
        },
      },
    });

    if (!result) {
      return errorResponse("Not found", 404);
    }
    return successResponse(result, "Got");
  }
}

export const bannerService = new BannerService();
