import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { categorySchema } from "@/types/schema";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

// PUT update category and its subcategories
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
    const validatedData = categorySchema.parse(body);

    // Check if a different category with the same name or slug exists
    const existingCategory = await prisma.categories.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug: validatedData.slug }],
        NOT: {
          id: id,
        },
      },
    });

    if (existingCategory) {
      throw {
        name: "ValidationError",
        message: "Danh mục với tên hoặc slug này đã tồn tại",
        code: "DUPLICATE_CATEGORY",
      };
    }

    // Update category
    const category = await prisma.categories.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    });

    // Handle subcategories
    if (validatedData.subcategories) {
      // Check for duplicate subcategory names/slugs within the request
      const subNames = validatedData.subcategories.map((sub) => sub.name);
      const subSlugs = validatedData.subcategories.map((sub) => sub.slug);

      if (
        new Set(subNames).size !== subNames.length ||
        new Set(subSlugs).size !== subSlugs.length
      ) {
        throw {
          name: "ValidationError",
          message: "Danh mục con chứa tên hoặc slug trùng lặp",
          code: "DUPLICATE_SUBCATEGORIES",
        };
      }

      // Get existing subcategories
      const existingSubs = await prisma.subcategories.findMany({
        where: { category_id: id },
      });

      // Create new subcategories that don't exist
      const newSubs = validatedData.subcategories.filter(
        (sub) => !existingSubs.some((existing) => existing.id === sub.id)
      );

      if (newSubs.length > 0) {
        await prisma.subcategories.createMany({
          data: newSubs.map((sub) => ({
            name: sub.name,
            slug: sub.slug,
            category_id: id,
          })),
        });
      }

      // Update existing subcategories
      for (const sub of validatedData.subcategories.filter((sub) => sub.id)) {
        await prisma.subcategories.update({
          where: { id: sub.id },
          data: {
            name: sub.name,
            slug: sub.slug,
          },
        });
      }

      // Delete subcategories that are not in the new list
      const subsToDelete = existingSubs.filter(
        (existing) =>
          !validatedData.subcategories?.some((sub) => sub.id === existing.id)
      );

      if (subsToDelete.length > 0) {
        await prisma.subcategories.deleteMany({
          where: {
            id: {
              in: subsToDelete.map((sub) => sub.id),
            },
          },
        });
      }
    }

    // Fetch updated category with subcategories
    const updatedCategory = await prisma.categories.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });

    if (!updatedCategory) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy danh mục",
        code: "CATEGORY_NOT_FOUND",
      };
    }

    return apiSuccess(updatedCategory, "Cập nhật danh mục thành công");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE category (subcategories will be automatically deleted due to cascade)
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

    // Check if category exists
    const existingCategory = await prisma.categories.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy danh mục",
        code: "CATEGORY_NOT_FOUND",
      };
    }

    // Check if this category has related products
    const relatedProducts = await prisma.products.findFirst({
      where: { category_id: id },
    });

    if (relatedProducts) {
      throw {
        name: "ValidationError",
        message: "Không thể xóa danh mục đang có sản phẩm liên kết",
        code: "CATEGORY_IN_USE",
      };
    }

    await prisma.categories.delete({
      where: { id },
    });

    return apiSuccess({ deleted: true }, "Xóa danh mục thành công");
  } catch (error) {
    return handleApiError(error);
  }
}

// GET a single category by ID
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

    const category = await prisma.categories.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      throw {
        name: "ValidationError",
        message: "Không tìm thấy danh mục",
        code: "CATEGORY_NOT_FOUND",
      };
    }

    return apiSuccess(category);
  } catch (error) {
    return handleApiError(error);
  }
}
