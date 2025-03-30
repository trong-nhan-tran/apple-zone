import { ca } from "date-fns/locale";
import { z } from "zod";

// Date schema để xử lý cả string và Date
const dateSchema = z.union([
  z.string().transform((str) => new Date(str)),
  z.date(),
]);

// Base schemas
export const bannerImageSchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  url: z.string().url("URL không hợp lệ"),
  category_id: z.number().int().optional().nullable(),
  direct_link: z.string().optional().nullable(),
  categories: z
    .object({
      id: z.number().int().optional(),
      created_at: dateSchema.optional(),
      name: z.string().min(1, "Tên danh mục không được để trống"),
      slug: z.string().min(1, "Slug không được để trống"),
    })
    .optional()
    .nullable(),
});

export const subcategorySchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  name: z.string().min(1, "Tên danh mục con không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  category_id: z.number().int().optional().nullable(),
});

export const categorySchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  name: z.string().min(1, "Tên danh mục không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  subcategories: z.array(subcategorySchema).optional(),
});

export const colorSchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  name: z.string().min(1, "Tên màu không được để trống"),
  code: z.string().optional().nullable(),
});

export const orderItemSchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  color: z.string().min(1, "Màu sắc không được để trống"),
  option: z.string().min(1, "Tuỳ chọn không được để trống"),
  price: z.number().positive("Giá phải là số dương"),
  quantity: z.number().int().positive("Số lượng phải là số nguyên dương"),
  product_item_id: z.number().int().optional().nullable(),
  order_id: z.number().int().optional().nullable(),
});

export const orderSchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  customer_name: z.string().min(1, "Tên khách hàng không được để trống"),
  customer_phone: z.string().min(1, "Số điện thoại không được để trống"),
  shipping_address: z.string().min(1, "Địa chỉ giao hàng không được để trống"),
  status: z.string().default("đang xử lí"),
  order_items: z.array(orderItemSchema).optional(),
});

export const productColorImageSchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  urls: z.array(z.string().url("URL ảnh không hợp lệ")).optional(),
  color_id: z.number().int(), // nullable chấp nhận null
  product_id: z.number().int().optional().nullable(), // nullable chấp nhận null
  colors: colorSchema.optional(),
  new_images: z.array(z.any()).optional(),
});

export const productItemSchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  thumbnail: z.string().optional(),
  price: z.number().min(0, "Giá không được âm").default(0),
  slug: z.string().min(1, "Slug không được để trống"),
  product_id: z.number().int().optional().nullable(),
  subcategory_id: z.number().int().optional().nullable(),
  option_name: z.string().optional().nullable(),
  option_value: z.string().optional().nullable(),
  products: z
    .object({
      id: z.number().int().optional(),
      created_at: dateSchema.optional(),
      name: z.string().min(1, "Tên sản phẩm không được để trống").optional(),
      thumbnail: z.string().optional(),
      category_id: z.number().int().optional().nullable(),
      categories: categorySchema.optional(),
    })
    .optional()
    .nullable(),
  subcategories: subcategorySchema.optional().nullable(),
});

// Cập nhật productSchema để bao gồm màu sắc và hình ảnh
export const productSchema = z.object({
  id: z.number().int().optional(),
  created_at: dateSchema.optional(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  thumbnail: z.string().optional(),
  category_id: z.number().int().optional().nullable(),
  categories: categorySchema.optional(),
  product_color_images: z.array(productColorImageSchema).optional(),
  product_items: z.array(productItemSchema).optional(),
});

export type BannerImageType = z.infer<typeof bannerImageSchema>;
export type CategoryType = z.infer<typeof categorySchema>;
export type ColorType = z.infer<typeof colorSchema>;
export type OrderItemType = z.infer<typeof orderItemSchema>;
export type OrderType = z.infer<typeof orderSchema>;
export type ProductImageType = z.infer<typeof productColorImageSchema>;
export type ProductItemType = z.infer<typeof productItemSchema>;
export type ProductType = z.infer<typeof productSchema>;
export type SubcategoryType = z.infer<typeof subcategorySchema>;
