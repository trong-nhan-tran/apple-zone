import { BaseService } from "./base-service";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { productInputSchema, ProductInputType } from "@/schemas";

class ProductService extends BaseService<
  ProductInputType,
  typeof prisma.products,
  Prisma.productsInclude,
  Prisma.productsWhereInput
> {
  constructor() {
    super(prisma.products, "Product", productInputSchema);
  }
}

export const productService = new ProductService();
