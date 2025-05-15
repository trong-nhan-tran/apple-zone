import { ProductColorType } from "@/schemas";
import { ColumnDef } from "@/components/ui-custom/table";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { Trash, SquarePen } from "lucide-react";

export const getProductColorColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (color: ProductColorType) => void;
  onDelete: (color: ProductColorType) => void;
}): ColumnDef<ProductColorType>[] => [
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
    accessorKey: "color_name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.color_name}
      </span>
    ),
  },
  {
    header: "Ảnh đại diện",
    accessorKey: "thumbnail",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.thumbnail ? (
          <img
            src={row.original.thumbnail}
            alt={row.original.color_name || "Thumbnail"}
            className="h-12 w-12 object-cover rounded-md border"
          />
        ) : (
          <span className="text-gray-500">Không có ảnh</span>
        )}
      </div>
    ),
  },
  {
    header: "Danh sách ảnh",
    accessorKey: "images",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 flex-wrap">
        {row.original.images && row.original.images.length > 0 ? (
          row.original.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              className="h-12 w-12 object-cover rounded-md border"
            />
          ))
        ) : (
          <span className="text-gray-500">Không có ảnh</span>
        )}
      </div>
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
