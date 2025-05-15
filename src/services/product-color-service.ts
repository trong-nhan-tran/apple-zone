import { BaseService } from "./base-service";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { productColorInputSchema, ProductColorInputType } from "@/schemas";

class ProductColorService extends BaseService<
  ProductColorInputType,
  typeof prisma.product_colors,
  Prisma.product_colorsInclude,
  Prisma.product_colorsWhereInput
> {
  constructor() {
    super(prisma.product_colors, "Product color", productColorInputSchema);
  }

  // Override the create method to include additional logic if needed
}

export const productColorService = new ProductColorService();
