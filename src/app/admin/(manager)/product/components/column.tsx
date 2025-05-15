import { ProductType, ProductWithDetailType } from "@/schemas";
import { ColumnDef } from "@/components/ui-custom/table";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { SquarePen, Trash } from "lucide-react";

export const getProductColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
}): ColumnDef<ProductWithDetailType>[] => [
  {
    header: "Id",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.id}
      </span>
    ),
  },
  {
    header: "Dòng sản phẩm",
    accessorKey: "name-thumbnail",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.thumbnail && (
          <img
            src={row.original.thumbnail}
            alt={row.original.name}
            className="h-10 w-10 rounded-md object-cover"
          />
        )}

        <span className="whitespace-nowrap font-medium text-gray-900">
          {row.original.name}
        </span>
      </div>
    ),
  },

  {
    header: "Danh mục",
    accessorKey: "categories.name",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {row.original.categories?.name || "-"}
      </span>
    ),
  },
  {
    header: "Ngày thêm",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString("vi-VN")
          : ""}
      </span>
    ),
  },
  {
    header: "Màu sắc",
    accessorKey: "product_colors",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.product_colors &&
        row.original.product_colors.length > 0 ? (
          row.original.product_colors.map((items) => (
            <div
              key={items.color_name || items.id}
              className="flex items-center rounded-md border border-gray-200 p-1 shadow-sm hover:shadow-md transition-shadow"
            >
              {items.thumbnail && (
                <img
                  src={items.thumbnail}
                  alt={items.color_name || ""}
                  className="h-7 w-7 rounded-md object-cover"
                />
              )}
              <span className="mt-1 text-xs font-medium text-gray-600">
                {items.color_name}
              </span>
            </div>
          ))
        ) : (
          <span className="text-gray-500 italic">Chưa có màu</span>
        )}
      </div>
    ),
  },
  {
    header: "Thao tác",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ButtonWithTooltip
          type="button"
          tooltip="Chỉnh sửa"
          variant="primary"
          size="icon"
          className="rounded-full"
          onClick={() => onEdit(row.original)}
        >
          <SquarePen />
        </ButtonWithTooltip>
        <ButtonWithTooltip
          type="button"
          tooltip="Xóa"
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={() => onDelete(row.original)}
        >
          <Trash />
        </ButtonWithTooltip>
      </div>
    ),
  },
];
