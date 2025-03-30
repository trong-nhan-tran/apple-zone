import { apiSuccess, handleApiError } from "@/lib/api-response";
import prisma from "@/lib/prisma";
import { colorSchema } from "@/types/schema";

// GET all colors
export async function GET() {
  try {
    const colors = await prisma.colors.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return apiSuccess(colors);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST new color
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input data
    const validatedData = colorSchema.parse(body);

    // Check if color with same name already exists
    const existingColor = await prisma.colors.findFirst({
      where: {
        name: validatedData.name,
      },
    });

    if (existingColor) {
      throw {
        name: "ValidationError",
        message: "Màu sắc với tên này đã tồn tại",
        code: "DUPLICATE_COLOR",
      };
    }

    // Create new color
    const color = await prisma.colors.create({
      data: {
        name: validatedData.name,
        code: validatedData.code || null,
      },
    });

    return apiSuccess(color, "Tạo màu sắc thành công", 201);
  } catch (error) {
    // Use the common error handler
    return handleApiError(error);
  }
}
