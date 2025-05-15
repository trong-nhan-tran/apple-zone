import { z } from "zod";
import { banners, Prisma } from "@prisma/client";

export type BannerType = banners;
export type BannerWithDetailType = Prisma.bannersGetPayload<{
  include: {
    categories: true;
  };
}>;
export const bannerInputSchema = z.object({
  url: z.string().url("URL không hợp lệ"),
  category_id: z.number().int().optional().nullable(),
  direct_link: z.string().optional().nullable(),
});

export type BannerInputType = z.infer<typeof bannerInputSchema>;
