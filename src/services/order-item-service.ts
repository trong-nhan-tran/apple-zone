import { BaseService } from "./base-service";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { orderItemInputSchema, OrderItemInputType } from "@/schemas";
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from "@/libs/api-response";

class OrderItemService extends BaseService<
  OrderItemInputType,
  typeof prisma.order_items,
  Prisma.order_itemsInclude,
  Prisma.order_itemsWhereInput
> {
  constructor() {
    super(prisma.order_items, "Order item", orderItemInputSchema);
  }
}

export const orderItemService = new OrderItemService();
