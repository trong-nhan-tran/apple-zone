import { z } from "zod";
import { product_items, Prisma } from "@prisma/client";

export type ProductItemWithCategoryType = Prisma.product_itemsGetPayload<{
  include: {
    categories: true;
  };
}>;

export type ProductItemWithColorType = Prisma.product_itemsGetPayload<{
  include: {
    products: {
      include: {
        product_colors: true;
      };
    };
  };
}>;
export type ProductItemWithDetailType = Prisma.product_itemsGetPayload<{
  include: {
    products: {
      include: {
        product_items: true;
      };
    };
    stocks: {
      include: {
        product_colors: true;
      };
    };
  };
}>;

export const productItemInputSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  thumbnail: z.string().optional(),
  price: z.number().int().min(0, "Giá không được âm").default(0).optional(),
  slug: z.string().min(1, "Slug không được để trống"),
  product_id: z.number().int().optional().nullable(),
  category_id: z.number().int().optional().nullable(),
  option_name: z.string().optional(),
  option_value: z.string().optional(),
});
export const productItemInputSchemaFrontend = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  thumbnail: z.string().optional(),
  price: z
    .preprocess(
      (val) => (val === "" || val === null ? 0 : Number(val)),
      z.number().int().min(0, "Giá không được âm")
    )
    .optional(),
  slug: z.string().min(1, "Slug không được để trống"),
  product_id: z.number().int().optional().nullable(),
  category_id: z.number().int().optional().nullable(),
  option_name: z.string().optional(),
  option_value: z.string().optional(),
});

export type ProductItemInputType = z.infer<typeof productItemInputSchema>;
export type ProductItemInputTypeFrontend = z.infer<
  typeof productItemInputSchemaFrontend
>;
export type ProductItemType = product_items;
