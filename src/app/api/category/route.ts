import { apiSuccess, handleApiError } from "@/lib/api-response";
import prisma from "@/lib/prisma";
import { categorySchema } from "@/types/schema";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST new category with subcategories
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input data
    const validatedData = categorySchema.parse(body);

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.categories.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug: validatedData.slug }],
      },
    });

    if (existingCategory) {
      throw {
        name: "ValidationError",
        message: "Danh mục với tên hoặc slug này đã tồn tại",
        code: "DUPLICATE_CATEGORY",
      };
    }

    // Use a transaction to ensure both category and subcategories are created successfully
    const result = await prisma.$transaction(async (tx) => {
      // Create category first
      const category = await tx.categories.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
        },
      });

      // If there are subcategories, create them with the category_id
      if (
        validatedData.subcategories &&
        validatedData.subcategories.length > 0
      ) {
        // Check for duplicate subcategory names/slugs
        const subNames = validatedData.subcategories.map((sub) => sub.name);
        const subSlugs = validatedData.subcategories.map((sub) => sub.slug);

        // If there are subcategories with duplicate names or slugs, throw error
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

        // Create subcategories
        await tx.subcategories.createMany({
          data: validatedData.subcategories.map((sub) => ({
            name: sub.name,
            slug: sub.slug,
            category_id: category.id,
          })),
        });
      }

      // Fetch the category with its subcategories
      return await tx.categories.findUnique({
        where: { id: category.id },
        include: {
          subcategories: true,
        },
      });
    });

    return apiSuccess(result, "Tạo danh mục thành công", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
