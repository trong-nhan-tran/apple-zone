"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ColorFormModal from "./color-form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ColorType } from "@/types/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import { colorService } from "@/services/color";

type Props = {};

const ColorManagerPage = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [colors, setColors] = useState<ColorType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ColorType | undefined>(
    undefined
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorIdToDelete, setColorIdToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchColors = async () => {
    try {
      setIsLoading(true);
      const response = await colorService.getAll();
      if (response.err===false && response.data) {
        setColors(response.data);
      }
    } catch (error) {
      console.log("Error fetching colors:", error);
      toast.error("Không thể tải danh sách màu sắc.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleDelete = (colorId: string) => {
    setColorIdToDelete(colorId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!colorIdToDelete) return;

    try {
      const response = await colorService.delete(colorIdToDelete);
      if (response.err) {
        toast.error(response.mess || "Không thể xoá màu sắc.");
        return;
      }
      toast.success("Đã xoá màu sắc thành công");
      fetchColors(); // Refresh the list
    } catch (error) {
      console.error("Error deleting color:", error);
      toast.error("Không thể xoá màu sắc. Vui lòng thử lại sau.");
    } finally {
      setIsDeleteDialogOpen(false);
      setColorIdToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedColor(undefined);
    setIsOpen(true);
  };

  const filteredColors = colors.filter(
    (color) =>
      color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (color.code &&
        color.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="">
      <ColorFormModal
        open={isOpen}
        setOpen={setIsOpen}
        color={selectedColor}
        onSuccess={fetchColors}
      />
      <div className="sm:flex justify-between items-center my-5">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Màu sắc</h1>
        <div className="flex items-center gap-2 ">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm kiếm"
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              className={searchQuery ? "opacity-100" : "opacity-0"}
            >
              <i className="bi bi-x"></i>
            </Button>
          </div>

          <Button
            type="button"
            onClick={handleAddNew}
            className="bg-blue-500 hover:bg-blue-300"
          >
            <i className="bi bi-plus"></i>
            <span>Thêm mới</span>
          </Button>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá màu sắc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xoá màu sắc này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr className="divide-x divide-gray-200">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Tên màu sắc
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Mã màu
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Hiển thị
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Ngày thêm
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredColors.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 divide-x divide-gray-200"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {item.code || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.code && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.code }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("vi-VN")
                      : ""}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-2">
                      <ButtonWithTooltip
                        type="button"
                        tooltip="Chỉnh sửa"
                        variant="primary"
                        size="icon"
                        className="h-9 w-9 p-0"
                        onClick={() => {
                          setSelectedColor(item);
                          setIsOpen(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        type="button"
                        tooltip="Xóa"
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9 p-0"
                        onClick={() =>
                          item.id && handleDelete(item.id.toString())
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </ButtonWithTooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ColorManagerPage;
