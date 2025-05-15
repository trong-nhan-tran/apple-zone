import { z } from "zod";
import { Prisma, orders } from "@prisma/client";

export type OrderType = orders;
export type OrderWithDetailType = Prisma.ordersGetPayload<{
  include: {
    order_items: {
      include: {
        product_items: true;
      };
    };
  };
}>;

export const orderInputSchema = z.object({
  customer_name: z.string().min(1, "Tên không được để trống"),
  customer_phone: z.string().min(1, "Số điện thoại không được để trống"),
  customer_email: z.string().email("Email không hợp lệ"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  province: z.string().min(1, "Tỉnh không được để trống"),
  district: z.string().min(1, "Quận không được để trống"),
  ward: z.string().min(1, "Phường không được để trống"),
  status: z.enum(["đang chờ", "đang giao", "đã giao", "đã hủy"]),
});

export type OrderInputType = z.infer<typeof orderInputSchema>;
