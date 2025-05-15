import { BaseService } from "./base-service";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { stockInputSchema, StockInputType } from "@/schemas";

class StockService extends BaseService<
  StockInputType,
  typeof prisma.stocks,
  Prisma.stocksInclude,
  Prisma.stocksWhereInput
> {
  constructor() {
    super(prisma.stocks, "Stock", stockInputSchema);
  }
}

export const stockService = new StockService();
