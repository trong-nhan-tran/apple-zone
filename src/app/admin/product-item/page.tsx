"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProductItemType } from "@/types/schema";
import { productItemService } from "@/services/product-item";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import ProductItemFormModal from "./product-item-form";
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
// import { formatCurrency } from "@/lib/utils";

type Props = {};

const ProductItemManagerPage = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productItems, setProductItems] = useState<ProductItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductItem, setSelectedProductItem] =
    useState<ProductItemType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productItemIdToDelete, setProductItemIdToDelete] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProductItems = async () => {
    try {
      setIsLoading(true);
      const response = await productItemService.getAll();
      if (response.err === false && response.data) {
        setProductItems(response.data);
      }
    } catch (error) {
      console.log("Error fetching product items:", error);
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductItems();
  }, []);

  const handleDelete = (productItemId: string) => {
    setProductItemIdToDelete(productItemId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productItemIdToDelete) return;

    try {
      const response = await productItemService.delete(productItemIdToDelete);
      if (response.err) {
        toast.error(response.mess || "Không thể xoá sản phẩm.");
        return;
      }
      toast.success("Đã xoá sản phẩm thành công");
      fetchProductItems();
    } catch (error) {
      console.error("Error deleting product item:", error);
      toast.error("Không thể xoá sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setIsDeleteDialogOpen(false);
      setProductItemIdToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedProductItem(null);
    setIsOpen(true);
  };

  const handleEdit = (productItem: ProductItemType) => {
    setSelectedProductItem(productItem);
    setIsOpen(true);
  };

  const filteredProductItems = productItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.products?.name &&
        item.products.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.option_name &&
        item.option_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.option_value &&
        item.option_value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="">
      <ProductItemFormModal
        open={isOpen}
        setOpen={setIsOpen}
        productItem={selectedProductItem}
        onSuccess={() => {}}
      />

      <div className="sm:flex justify-between items-center my-5">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">
          Danh sách biến thể sản phẩm
        </h1>
        <div className="flex items-center gap-2">
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
            <AlertDialogTitle>Xác nhận xoá sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xoá sản phẩm này? Hành động này không thể
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
                  Thumbnail
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  <div>Tên sản phẩm</div>
                  <div className="text-xs text-gray-500">Slug ID</div>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Dòng sản phẩm
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Danh mục con
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Tuỳ chọn
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Giá bán
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
              {filteredProductItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 divide-x divide-gray-200"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <i className="bi bi-image text-gray-400"></i>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.slug}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.products?.name || (
                      <span>Chưa có dòng sản phẩm cha</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {item.subcategories?.name|| null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.option_name && item.option_value
                      ? `${item.option_name}: ${item.option_value}`
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {item.price}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-2">
                      <ButtonWithTooltip
                        type="button"
                        tooltip="Chỉnh sửa"
                        variant="primary"
                        size="icon"
                        className="h-9 w-9 p-0"
                        onClick={() => handleEdit(item)}
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

              {filteredProductItems.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchQuery
                      ? "Không tìm thấy sản phẩm nào khớp với tìm kiếm"
                      : "Chưa có sản phẩm nào. Bấm 'Thêm mới' để tạo sản phẩm."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductItemManagerPage;
