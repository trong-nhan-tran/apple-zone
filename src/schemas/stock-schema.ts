import { z } from "zod";
import { Prisma, stocks } from "@prisma/client";

export type StockType = stocks;

export type StockWithDetails = Prisma.stocksGetPayload<{
  include: {
    product_colors: true;
  };
}>;

export const stockInputSchema = z.object({
  product_color_id: z.number().int(),
  product_item_id: z.number().int(),
  stock: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().int().min(0, "Số lượng không được âm")
  ),
});

export type StockInputType = z.infer<typeof stockInputSchema>;
