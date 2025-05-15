import { ZodSchema } from "zod";
import {
  successResponse,
  errorResponse,
  ApiResponse,
} from "@/libs/api-response";

type Pagination = {
  page?: number;
  pageSize?: number;
};

export class BaseService<TInput, TModelDelegate, TInclude, TWhere> {
  protected model: TModelDelegate;
  protected modelName: string;
  protected inputSchema: ZodSchema<TInput>;

  constructor(
    model: TModelDelegate,
    modelName: string,
    inputSchema: ZodSchema<TInput>
  ) {
    this.model = model;
    this.modelName = modelName;
    this.inputSchema = inputSchema;
  }

  async create(data: TInput): Promise<ApiResponse<any>> {
    const result = this.inputSchema.safeParse(data);

    if (!result.success) {
      return errorResponse("Validation error", 400, result.error.errors);
    }

    // @ts-expect-error - delegate is generic
    const created = await this.model.create({ data: result.data });
    return successResponse(created, `${this.modelName} Created`, 201);
  }

  async update(id: string, data: TInput): Promise<ApiResponse<any>> {
    const result = this.inputSchema.safeParse(data);

    if (!result.success) {
      return errorResponse("Validation error", 400, result.error.errors);
    }

    // @ts-expect-error - delegate is generic
    const updated = await this.model.update({
      where: { id: Number(id) },
      data: result.data,
    });

    return successResponse(updated, `${this.modelName} Updated`);
  }

  async delete(id: string): Promise<ApiResponse<any>> {
    // @ts-expect-error
    const deleted = await this.model.delete({
      where: { id: Number(id) },
    });

    return successResponse(deleted, `${this.modelName} Deleted`);
  }

  async getAll(
    where: TWhere = {} as TWhere,
    pagination: Pagination = {},
    include?: TInclude
  ): Promise<ApiResponse<any>> {
    const { page = 1, pageSize = 10 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      // @ts-expect-error - delegate is generic
      this.model.findMany({
        where,
        include,
        skip,
        take: pageSize,
      }),
      // @ts-expect-error - delegate is generic
      this.model.count({ where }),
    ]);

    return successResponse(data, `${this.modelName} List Retrieved`, 200, {
      page: page,
      pageSize: pageSize,
      total: total,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  async getById(id: string, include?: TInclude): Promise<ApiResponse<any>> {
    // @ts-expect-error - delegate is generic
    const result = await this.model.findUnique({
      where: { id: Number(id) },
      include,
    });

    if (!result) {
      return errorResponse(`${this.modelName} not found`, 404);
    }

    return successResponse(result, `${this.modelName} Retrieved`);
  }
}
