"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui-shadcn/button";
import ConfirmModal from "@/components/ui-custom/confirm-modal";
import { ProductType, ProductColorType } from "@/schemas";
import ColorImagesForm from "./color-form";
import { productColorApi } from "@/apis";
import { DataTable } from "@/components/ui-custom/table";
import { getProductColorColumns } from "./column";

interface Props {
  product: ProductType | null;
  onSuccess?: () => void;
}

const ColorImagesTable = ({ product, onSuccess }: Props) => {
  const [productColors, setProductColors] = useState<ProductColorType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingColor, setEditingColor] = useState<ProductColorType | null>(
    null
  );
  const [colorToDelete, setColorToDelete] = useState<ProductColorType | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const fetchProductColors = async () => {
    try {
      setIsLoading(true);
      if (!product?.id) return;
      const response = await productColorApi.getAll({
        productId: String(product.id),
      });

      if (response.success && response.data) {
        setProductColors(response.data);
      } else {
        toast.error("Không thể tải dữ liệu màu sắc sản phẩm");
      }
    } catch (error) {
      console.error("Error fetching product colors:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (product?.id) {
      fetchProductColors();
    }
  }, [product]);

  const handleAddColor = () => {
    setEdit(false);
    setEditingColor(null);
    setOpenForm(true);
  };

  const handleEditColor = (color: ProductColorType) => {
    setEdit(true);
    setEditingColor(color);
    setOpenForm(true);
  };

  const handleDeleteColor = async () => {
    if (!colorToDelete?.id) return;

    try {
      const response = await productColorApi.delete(
        colorToDelete.id.toString()
      );
      if (response.success) {
        setProductColors(
          productColors.filter((item) => item.id !== colorToDelete.id)
        );
        toast.success(response.message || "Đã xóa màu sắc sản phẩm thành công");
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || "Không thể xóa dữ liệu");
      }
    } catch (error) {
      console.error("Error deleting product color:", error);
      toast.error("Đã xảy ra lỗi khi xóa dữ liệu");
    } finally {
      setIsDeleteDialogOpen(false);
      setColorToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    fetchProductColors();
    setOpenForm(false);
    if (onSuccess) onSuccess();
  };

  const columns = getProductColorColumns({
    onEdit: handleEditColor,
    onDelete: (color) => {
      setColorToDelete(color);
      setIsDeleteDialogOpen(true);
    },
  });

  return (
    <div className="space-y-4">
      <ColorImagesForm
        open={openForm}
        setOpen={setOpenForm}
        productId={String(product?.id) || ""}
        onSuccess={handleFormSuccess}
        itemToEdit={editingColor}
        isEdit={edit}
      />

      <ConfirmModal
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa màu sắc sản phẩm"
        description={`Bạn có chắc chắn muốn xóa màu ${
          colorToDelete?.color_name || ""
        } không?`}
        onConfirm={handleDeleteColor}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Màu sắc sản phẩm</h2>
        <Button
          onClick={handleAddColor}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <i className="bi bi-plus mr-1"></i>
          Thêm màu sắc
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={productColors}
        loading={isLoading}
        emptyState={
          <div className="text-center py-8">
            <i className="bi bi-palette text-4xl text-gray-300"></i>
            <p className="mt-2 text-gray-500">
              Chưa có màu sắc nào cho sản phẩm này
            </p>
            <Button onClick={handleAddColor} variant="outline" className="mt-4">
              Thêm màu sắc
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default ColorImagesTable;
