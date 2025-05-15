import { z } from "zod";
import { Prisma, order_items } from "@prisma/client";

export type OrderItemType = order_items;
export type OrderItemWithDetailType = Prisma.order_itemsGetPayload<{
  include: {
    product_items: true;
  };
}>;

export const orderItemInputSchema = z.object({
  order_id: z.coerce.number().int().min(1, "ID đơn hàng không được để trống"),
  product_item_id: z.coerce
    .number()
    .int()
    .min(1, "Mã sản phẩm không được để trống"),
  product_name: z.string().min(1, "Tên sản phẩm không được để trống"),
  quantity: z.coerce.number().int().min(1, "Số lượng không được để trống"),
  color_name: z.string().min(1, "Tên màu không được để trống"),
  option_name: z.string().min(1, "Tên tùy chọn không được để trống"),
  option_value: z.string().min(1, "Giá trị tùy chọn không được để trống"),
  price: z.coerce.number().min(1, "Giá không được để trống"),
});
export type OrderItemInputType = z.infer<typeof orderItemInputSchema>;
