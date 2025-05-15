import { z } from "zod";
import { product_colors } from "@prisma/client";
export const productColorInputSchema = z.object({
  color_name: z.string().min(1, "Tên màu không được để trống"),
  thumbnail: z.string().url("URL ảnh không hợp lệ"),
  images: z.array(z.string().url("URL ảnh không hợp lệ")).optional(),
  product_id: z.number().int().optional().nullable(),
});

export const productColorInputSchemaFrontend = z.object({
  color_name: z.string().min(1, "Tên màu không được để trống"),
  thumbnail: z.string().url("URL ảnh không hợp lệ"),
  images: z
    .array(
      z.object({
        url: z.string().url("URL ảnh không hợp lệ"),
        file: z.any().optional(),
        isNew: z.boolean().optional(),
      })
    )
    .default([]),
  product_id: z.number().int().optional().nullable(),
});

export type ProductColorInputType = z.infer<typeof productColorInputSchema>;
export type ProductColorType = product_colors;
export type ProductColorInputTypeFrontend = z.infer<
  typeof productColorInputSchemaFrontend
>;
