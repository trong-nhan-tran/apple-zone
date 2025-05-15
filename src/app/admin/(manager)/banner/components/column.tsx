import { BannerType, BannerWithDetailType } from "@/schemas";
import { ColumnDef } from "@/components/ui-custom/table";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { Trash, SquarePen } from "lucide-react";

export const getBannerColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: BannerType) => void;
  onDelete: (item: BannerType) => void;
}): ColumnDef<BannerWithDetailType>[] => [
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
    header: "Banner",
    accessorKey: "url",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.url && (
          <img
            src={row.original.url}
            alt={row.original.url}
            className="h-8 rounded-md object-cover"
          />
        )}
      </div>
    ),
  },

  {
    header: "Link chuyển hướng",
    accessorKey: "direct_link",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.direct_link}</span>
    ),
  },
  {
    header: "Danh mục",
    accessorKey: "parent_id",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.categories?.name
          ? row.original.categories.name
          : "Không có"}
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
