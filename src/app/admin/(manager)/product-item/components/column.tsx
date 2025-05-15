import { ProductItemType, ProductItemWithCategoryType } from "@/schemas";
import { ColumnDef } from "@/components/ui-custom/table";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { SquarePen, Trash } from "lucide-react";

export const getProductItemColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (productItem: ProductItemType) => void;
  onDelete: (productItem: ProductItemType) => void;
}): ColumnDef<ProductItemWithCategoryType>[] => [
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
    header: "Sản phẩm",
    accessorKey: "name-slug-thumbnail",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.thumbnail && (
          <img
            src={row.original.thumbnail}
            alt={row.original.name}
            className="h-10 w-10 rounded-md object-cover"
          />
        )}
        <div className="flex flex-col">
          <span className="whitespace-nowrap font-medium text-gray-900">
            {row.original.name}
          </span>
          <span className="text-sm text-gray-500">{row.original.slug}</span>
        </div>
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
    header: "Giá",
    accessorKey: "price",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {row.original.price
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.original.price)
          : "0"}
      </span>
    ),
  },
  {
    header: "Tuỳ chọn",
    accessorKey: "option_name-option_value",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {row.original.option_name && row.original.option_value
          ? `${row.original.option_name}: ${row.original.option_value}`
          : "-"}
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
