import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/types/schema";
import { apiSuccess, handleApiError } from "@/lib/api-response";

// Get product details by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      throw {
        name: "ValidationError",
        message: "ID sản phẩm không hợp lệ",
        code: "INVALID_ID",
      };
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        categories: true,
        product_color_images: {
          include: {
            colors: true,
          },
        },
        product_items: true,
      },
    });

    if (!product) {
      throw {
        name: "ValidationError",
        message: `Không tìm thấy sản phẩm với ID ${productId}`,
        code: "PRODUCT_NOT_FOUND",
      };
    }

    return apiSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}

// Update product information
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      throw {
        name: "ValidationError",
        message: "ID sản phẩm không hợp lệ",
        code: "INVALID_ID",
      };
    }

    const body = await request.json();
    const validationResult = productSchema.safeParse(body);

    if (!validationResult.success) {
      throw {
        name: "ValidationError",
        message: "Dữ liệu sản phẩm không hợp lệ",
        code: "VALIDATION_ERROR",
        detail: validationResult.error.format(),
      };
    }

    // Check if product exists
    const productData = validationResult.data;
    const existingProduct = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw {
        name: "ValidationError",
        message: `Không tìm thấy sản phẩm với ID ${productId}`,
        code: "PRODUCT_NOT_FOUND",
      };
    }

    // Update product
    await prisma.products.update({
      where: { id: productId },
      data: {
        name: productData.name,
        thumbnail: productData.thumbnail,
        category_id: productData.category_id,
      },
    });

    if (
      productData.product_color_images &&
      productData.product_color_images.length > 0
    ) {
      const existingProductImages = await prisma.product_color_images.findMany({
        where: {
          product_id: productId,
        },
        select: {
          color_id: true,
        },
      });

      // Get list of color_ids from current product_color_images
      const existingColorIds = existingProductImages.map(
        (item) => item.color_id
      );
      const newColorIds = productData.product_color_images.map(
        (item) => item.color_id
      );

      // Find color_ids to delete
      const colorIdsToDelete = existingColorIds.filter(
        (id) => !newColorIds.includes(id)
      );

      if (colorIdsToDelete.length > 0) {
        await prisma.product_color_images.deleteMany({
          where: {
            product_id: productId,
            color_id: {
              in: colorIdsToDelete,
            },
          },
        });
      }

      for (const item of productData.product_color_images) {
        // Check if the color image already exists
        const existingColorImage = await prisma.product_color_images.findFirst({
          where: {
            product_id: productId,
            color_id: item.color_id,
          },
        });

        if (existingColorImage) {
          // Update existing record
          await prisma.product_color_images.update({
            where: { id: existingColorImage.id },
            data: { urls: item.urls },
          });
        } else {
          // Create new record
          await prisma.product_color_images.create({
            data: {
              product_id: productId,
              color_id: item.color_id,
              urls: item.urls || [],
            },
          });
        }
      }
    }

    // Fetch the updated product
    const updatedProduct = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        categories: true,
        product_color_images: {
          include: {
            colors: true,
          },
        },
        product_items: true,
      },
    });

    return apiSuccess(updatedProduct, "Cập nhật sản phẩm thành công");
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      throw {
        name: "ValidationError",
        message: "ID sản phẩm không hợp lệ",
        code: "INVALID_ID",
      };
    }

    // Check if the product exists
    const existingProduct = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        product_color_images: true,
      },
    });

    if (!existingProduct) {
      throw {
        name: "ValidationError",
        message: `Không tìm thấy sản phẩm với ID ${productId}`,
        code: "PRODUCT_NOT_FOUND",
      };
    }

    // Delete the product (DB constraints are handled at DB level)
    await prisma.products.delete({
      where: { id: productId },
    });

    return apiSuccess({ deleted: true }, `Xóa sản phẩm thành công`);
  } catch (error) {
    return handleApiError(error);
  }
}
