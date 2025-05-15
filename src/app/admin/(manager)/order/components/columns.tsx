import { OrderType, OrderWithDetailType } from "@/schemas";
import { ColumnDef } from "@/components/ui-custom/table";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { Trash, SquarePen, Eye } from "lucide-react";
import { Badge } from "@/components/ui-shadcn/badge";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "đang chờ":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 border-yellow-300 text-yellow-800"
        >
          Đang chờ
        </Badge>
      );
    case "đang giao":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 border-blue-300 text-blue-800"
        >
          Đang giao
        </Badge>
      );
    case "đã giao":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 border-green-300 text-green-800"
        >
          Đã giao
        </Badge>
      );
    case "đã hủy":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 border-red-300 text-red-800"
        >
          Đã hủy
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getOrderColumns = ({
  onEdit,
  onDelete,
  onView,
}: {
  onEdit: (item: OrderType) => void;
  onDelete: (item: OrderType) => void;
  onView?: (item: OrderType) => void;
}): ColumnDef<OrderWithDetailType>[] => [
  {
    header: "Mã ĐH",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        #{row.original.id}
      </span>
    ),
  },
  {
    header: "Khách hàng",
    accessorKey: "customer_name-phone-email",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {row.original.customer_name}
        </span>
        <span className="text-sm text-gray-500">
          {row.original.customer_phone}
        </span>
        <span className="text-sm text-gray-500">
          {row.original.customer_email}
        </span>
      </div>
    ),
  },
  {
    header: "Sản phẩm",
    accessorKey: "order_items",
    cell: ({ row }) => {
      const orderItems = row.original.order_items || [];
      const totalItems = orderItems.length;

      return (
        <div className="flex flex-col">
          {totalItems > 0 ? (
            <>
              {/* Show first two items directly */}
              {orderItems.slice(0, 2).map((item, index) => (
                <div key={index} className="text-sm mb-1 line-clamp-1">
                  <span className="font-medium">{item.quantity}x</span>{" "}
                  <span className="text-gray-700">{item.product_name}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({item.color_name}, {item.option_value})
                  </span>
                </div>
              ))}

              {/* Show count of remaining items if more than 2 */}
              {totalItems > 2 && (
                <span className="text-xs text-blue-600">
                  + {totalItems - 2} sản phẩm khác
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-500 italic">Không có sản phẩm</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Địa chỉ",
    accessorKey: "address",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-gray-700 line-clamp-2">
          {row.original.address}
        </span>
        <span className="text-sm text-gray-500">{row.original.ward}</span>
        <span className="text-sm text-gray-500">{row.original.district}</span>
        <span className="text-sm text-gray-500">{row.original.province}</span>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    accessorKey: "status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    header: "Tổng tiền",
    accessorKey: "total",
    cell: ({ row }) => {
      // Calculate total from order items
      const total =
        row.original.order_items?.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0
        ) || 0;

      return (
        <span className="whitespace-nowrap font-medium text-gray-900">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(total)}
        </span>
      );
    },
  },
  {
    header: "Ngày đặt",
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
        {onView && (
          <ButtonWithTooltip
            type="button"
            tooltip="Xem chi tiết"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </ButtonWithTooltip>
        )}
        <ButtonWithTooltip
          type="button"
          tooltip="Cập nhật trạng thái"
          variant="primary"
          size="icon"
          className="rounded-full"
          onClick={() => onEdit(row.original)}
        >
          <SquarePen className="h-4 w-4" />
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
