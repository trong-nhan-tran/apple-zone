import { CategoryType } from "@/schemas";
import { ColumnDef } from "@/components/ui-custom/table";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { Trash, SquarePen } from "lucide-react";

export const getCategoryColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (product: CategoryType) => void;
  onDelete: (product: CategoryType) => void;
}): ColumnDef<CategoryType>[] => [
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
    header: "Tên danh mục",
    accessorKey: "name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.name}
      </span>
    ),
  },

  {
    header: "Slug",
    accessorKey: "slug",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.slug}</span>
    ),
  },
  {
    header: "Danh mục cha",
    accessorKey: "parent_id",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.parent_id ? row.original.parent_id : "Không có"}
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
