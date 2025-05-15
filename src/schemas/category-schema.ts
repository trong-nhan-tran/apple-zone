import { z } from "zod";
import { categories, Prisma } from "@prisma/client";

export type CategoryType = categories;
export type CategoryWithDetailType = Prisma.categoriesGetPayload<{
  include: {
    categories: true;
  };
}>;

export const categoryInputSchema = z.object({
  name: z.string().min(1, "Trường bắt buộc"),
  slug: z.string().min(1, "Trường bắt buộc"),
  parent_id: z.number().int().optional().nullable(),
});

export type CategoryInputType = z.infer<typeof categoryInputSchema>;
