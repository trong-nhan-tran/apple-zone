import { StockWithDetails } from "@/schemas";
import { ColumnDef } from "@/components/ui-custom/table";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { Trash, SquarePen } from "lucide-react";

export const getProductColorColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: StockWithDetails) => void;
  onDelete: (item: StockWithDetails) => void;
}): ColumnDef<StockWithDetails>[] => [
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
    header: "Màu sắc",
    accessorKey: "color_name-thumbnail",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.product_colors && (
          <img
            src={row.original.product_colors?.thumbnail || ""}
            alt={row.original.product_colors?.color_name}
            className="h-10 w-10 rounded-md object-cover"
          />
        )}

        <span className="whitespace-nowrap font-medium text-gray-900">
          {row.original.product_colors?.color_name}
        </span>
      </div>
    ),
  },

  {
    header: "Số lượng",
    accessorKey: "stock",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.stock}
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
