import { apiSuccess, handleApiError } from "@/lib/api-response";
import prisma from "@/lib/prisma";
import { bannerImageSchema } from "@/types/schema";

// GET a single banner by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      throw {
        name: "ValidationError",
        message: "ID không hợp lệ",
        code: "INVALID_ID",
      };
    }

    const banner = await prisma.banner_images.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!banner) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy banner",
        code: "BANNER_NOT_FOUND",
      };
    }

    return apiSuccess(banner);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update banner
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      throw {
        name: "ValidationError",
        message: "ID không hợp lệ",
        code: "INVALID_ID",
      };
    }

    // Check if banner exists
    const existingBanner = await prisma.banner_images.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy banner",
        code: "BANNER_NOT_FOUND",
      };
    }

    // Validate input data
    const validatedData = bannerImageSchema.parse(body);

    // Check if category exists when category_id is provided
    if (validatedData.category_id) {
      const categoryExists = await prisma.categories.findUnique({
        where: { id: validatedData.category_id },
      });

      if (!categoryExists) {
        throw {
          name: "ValidationError",
          message: "Danh mục không tồn tại",
          code: "CATEGORY_NOT_FOUND",
        };
      }
    }

    // Update banner
    const updatedBanner = await prisma.banner_images.update({
      where: { id },
      data: {
        url: validatedData.url,
        category_id: validatedData.category_id,
        direct_link: validatedData.direct_link,
      },
      include: {
        categories: true,
      },
    });

    return apiSuccess(updatedBanner, "Cập nhật banner thành công");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE banner
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      throw {
        name: "ValidationError",
        message: "ID không hợp lệ",
        code: "INVALID_ID",
      };
    }

    // Check if banner exists
    const existingBanner = await prisma.banner_images.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy banner",
        code: "BANNER_NOT_FOUND",
      };
    }

    await prisma.banner_images.delete({
      where: { id },
    });

    return apiSuccess({ deleted: true }, "Xóa banner thành công");
  } catch (error) {
    return handleApiError(error);
  }
}
