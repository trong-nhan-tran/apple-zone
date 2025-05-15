import { z } from "zod";
import { products, Prisma } from "@prisma/client";

export type ProductType = products;
export type ProductWithDetailType = Prisma.productsGetPayload<{
  include: {
    categories: true;
    product_colors: true;
    product_items: true;
  };
}>;
export type ProductCardType = Prisma.productsGetPayload<{
  include: {
    product_items: true;
  };
}>;

export const productInputSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  category_id: z.number().int().nullable(),
});

export type ProductInputType = z.infer<typeof productInputSchema>;
