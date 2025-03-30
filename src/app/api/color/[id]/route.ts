import prisma from "@/lib/prisma";
import { colorSchema } from "@/types/schema";
import { apiSuccess, handleApiError } from "@/lib/api-response";

// GET a single color by ID
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

    const color = await prisma.colors.findUnique({
      where: { id },
    });

    if (!color) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy màu sắc",
        code: "COLOR_NOT_FOUND",
      };
    }

    return apiSuccess(color);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update color
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
    const validatedData = colorSchema.parse(body);

    // Check if a different color with the same name exists
    const existingColor = await prisma.colors.findFirst({
      where: {
        name: validatedData.name,
        NOT: {
          id: id,
        },
      },
    });

    if (existingColor) {
      throw {
        name: "ValidationError",
        message: "Màu sắc với tên này đã tồn tại",
        code: "DUPLICATE_COLOR",
      };
    }

    // Update color
    const color = await prisma.colors.update({
      where: { id },
      data: {
        name: validatedData.name,
        code: validatedData.code || null,
      },
    });

    return apiSuccess(color, "Cập nhật màu sắc thành công");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE color
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

    // Check if color exists
    const existingColor = await prisma.colors.findUnique({
      where: { id },
    });

    if (!existingColor) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy màu sắc",
        code: "COLOR_NOT_FOUND",
      };
    }

    // Check if this color is used in product_color_images
    const relatedProductImages = await prisma.product_color_images.findFirst({
      where: { color_id: id },
    });

    if (relatedProductImages) {
      throw {
        name: "ValidationError",
        message: "Không thể xóa màu sắc đang được sử dụng trong sản phẩm",
        code: "COLOR_IN_USE",
      };
    }

    await prisma.colors.delete({
      where: { id },
    });

    return apiSuccess({ deleted: true }, "Xóa màu sắc thành công");
  } catch (error) {
    return handleApiError(error);
  }
}
