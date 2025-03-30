"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryFormModal from "./category-form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { CategoryType } from "@/types/schema";
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
import { categoryService } from "@/services/category";

type Props = {};

const CategoryManagerPage = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | undefined
  >(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.getAll();
      if (response.err ===false && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (categoryId: string) => {
    setCategoryIdToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

const confirmDelete = async () => {
  if (!categoryIdToDelete) return;

  try {
    await categoryService.delete(categoryIdToDelete);
    toast.success("Đã xoá danh mục thành công");
    fetchCategories(); // Refresh the list
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error("Không thể xoá danh mục. Vui lòng thử lại sau.");
  } finally {
    setIsDeleteDialogOpen(false);
    setCategoryIdToDelete(null);
  }
};

  const handleAddNew = () => {
    setSelectedCategory(undefined);
    setIsOpen(true);
  };

  return (
    <div className="">
      <CategoryFormModal
        open={isOpen}
        setOpen={setIsOpen}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />
      <div className="sm:flex justify-between items-center my-5">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Danh mục</h1>
        <div className="flex items-center gap-2 ">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm kiếm"
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter"}
            />
            <Button
              onClick={() => {
                setIsOpen(true);
                setSelectedCategory(undefined);
              }}
            >
              <i className="bi bi-search"></i>
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
            <AlertDialogTitle>Xác nhận xoá danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xoá danh mục này? Hành động này không thể
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
                  Tên Danh mục
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Danh mục con
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Slug ID
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
              {categories?.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 divide-x divide-gray-200"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {item.name}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {item.subcategories && item.subcategories.length > 0 ? (
                        item.subcategories.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {item.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 italic">
                          Không có danh mục con
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {item.slug}
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
                          setSelectedCategory(item);
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

export default CategoryManagerPage;
