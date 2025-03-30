import prisma from "@/lib/prisma";
import { productItemSchema } from "@/types/schema";
import { apiSuccess, handleApiError } from "@/lib/api-response";

// GET a single product item by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = params;
    const id = parseInt(paramId);

    if (isNaN(id)) {
      throw {
        name: "ValidationError",
        message: "ID không hợp lệ",
        code: "INVALID_ID",
      };
    }

    const productItem = await prisma.product_items.findUnique({
      where: { id },
      include: {
        products: true,
        subcategories: true,
      },
    });

    if (!productItem) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy sản phẩm",
        code: "PRODUCT_ITEM_NOT_FOUND",
      };
    }

    return apiSuccess(productItem);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update product item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id: paramId } = params;
    const id = parseInt(paramId);

    if (isNaN(id)) {
      throw {
        name: "ValidationError",
        message: "ID không hợp lệ",
        code: "INVALID_ID",
      };
    }

    // Validate input data
    const validatedData = productItemSchema.parse(body);

    // Check if a different product item with the same name or slug exists
    const existingProductItem = await prisma.product_items.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug: validatedData.slug }],
        NOT: {
          id: id,
        },
      },
    });

    if (existingProductItem) {
      throw {
        name: "ValidationError",
        message: "Sản phẩm với tên hoặc slug này đã tồn tại",
        code: "DUPLICATE_PRODUCT_ITEM",
      };
    }

    // Update product item
    const productItem = await prisma.product_items.update({
      where: { id },
      data: {
        name: validatedData.name,
        thumbnail: validatedData.thumbnail || null,
        price: validatedData.price,
        slug: validatedData.slug,
        product_id: validatedData.product_id || null,
        subcategory_id: validatedData.subcategory_id || null,
        option_name: validatedData.option_name || null,
        option_value: validatedData.option_value || null,
      },
      include: {
        products: true,
        subcategories: true,
      },
    });

    return apiSuccess(productItem, "Cập nhật sản phẩm thành công");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE product item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = params;
    const id = parseInt(paramId);

    if (isNaN(id)) {
      throw {
        name: "ValidationError",
        message: "ID không hợp lệ",
        code: "INVALID_ID",
      };
    }

    // Check if product item exists
    const existingProductItem = await prisma.product_items.findUnique({
      where: { id },
    });

    if (!existingProductItem) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy sản phẩm",
        code: "PRODUCT_ITEM_NOT_FOUND",
      };
    }

    // Check if this product item is used in orders
    const relatedOrderItems = await prisma.order_items.findFirst({
      where: { product_item_id: id },
    });

    if (relatedOrderItems) {
      throw {
        name: "ValidationError",
        message: "Không thể xóa sản phẩm đang được sử dụng trong đơn hàng",
        code: "PRODUCT_ITEM_IN_USE",
      };
    }

    await prisma.product_items.delete({
      where: { id },
    });

    return apiSuccess({ deleted: true }, "Xóa sản phẩm thành công");
  } catch (error) {
    return handleApiError(error);
  }
}
