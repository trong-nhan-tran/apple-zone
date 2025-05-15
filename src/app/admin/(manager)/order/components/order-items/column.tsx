import { OrderItemWithDetailType } from "@/schemas";
import { ColumnDef } from "@/components/ui-custom/table";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { Trash, Edit } from "lucide-react";

export const getOrderItemColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: OrderItemWithDetailType) => void;
  onDelete: (item: OrderItemWithDetailType) => void;
}): ColumnDef<OrderItemWithDetailType>[] => [
  {
    header: "Sản phẩm",
    accessorKey: "product_name",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.original.product_name}
      </div>
    ),
  },
  {
    header: "Màu sắc",
    accessorKey: "color_name",
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.original.color_name}</div>
    ),
  },
  {
    header: "Tùy chọn",
    accessorKey: "option",
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">
        {row.original.option_name}: {row.original.option_value}
      </div>
    ),
  },
  {
    header: "Số lượng",
    accessorKey: "quantity",
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.original.quantity}</div>
    ),
  },
  {
    header: "Đơn giá",
    accessorKey: "price",
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(row.original.price))}
      </div>
    ),
  },
  {
    header: "Thành tiền",
    accessorKey: "total",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(row.original.price) * row.original.quantity)}
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
          tooltip="Sửa"
          variant="primary"
          size="icon"
          className="rounded-full"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
        </ButtonWithTooltip>
        <ButtonWithTooltip
          type="button"
          tooltip="Xóa"
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={() => onDelete(row.original)}
        >
          <Trash className="h-4 w-4" />
        </ButtonWithTooltip>
      </div>
    ),
  },
];
