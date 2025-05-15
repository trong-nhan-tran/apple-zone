import { BaseService } from "./base-service";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { orderInputSchema, OrderInputType } from "@/schemas";
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from "@/libs/api-response";

class OrderService extends BaseService<
  OrderInputType,
  typeof prisma.orders,
  Prisma.ordersInclude,
  Prisma.ordersWhereInput
> {
  constructor() {
    super(prisma.orders, "Order", orderInputSchema);
  }
}

export const orderService = new OrderService();
