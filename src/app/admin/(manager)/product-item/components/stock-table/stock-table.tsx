"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui-shadcn/button";
import ConfirmModal from "@/components/ui-custom/confirm-modal";
import { ProductItemType, StockWithDetails } from "@/schemas";
import StockForm from "./stock-form";
import { stockApi, productColorApi } from "@/apis";
import { DataTable } from "@/components/ui-custom/table";
import { getProductColorColumns } from "./column";

interface Props {
  productItem: ProductItemType | null;
  onSuccess?: () => void;
}

const StockTable = ({ productItem, onSuccess }: Props) => {
  const [stocks, setStocks] = useState<StockWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingStock, setEditingStock] = useState<StockWithDetails | null>(
    null
  );
  const [stockToDelete, setStockToDelete] = useState<StockWithDetails | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productColors, setProductColors] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      if (!productItem?.id) return;
      const response = await stockApi.getAll({
        productItemId: String(productItem.id),
      });

      if (response.success && response.data) {
        setStocks(response.data);
      } else {
        toast.error("Không thể tải dữ liệu tồn kho");
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductColors = async () => {
    try {
      if (!productItem?.product_id) return;
      const response = await productColorApi.getAll({
        productId: String(productItem.product_id),
      });
      if (response.success && response.data) {
        setProductColors(response.data);
      }
    } catch (error) {
      console.error("Error fetching product colors:", error);
    }
  };

  useEffect(() => {
    if (productItem?.id) {
      fetchStocks();
      fetchProductColors();
    }
  }, [productItem]);

  const handleAddStock = () => {
    setIsEdit(false);
    setEditingStock(null);
    setOpenForm(true);
  };

  const handleEditStock = (stock: StockWithDetails) => {
    setIsEdit(true);
    setEditingStock(stock);
    setOpenForm(true);
  };

  const handleDeleteStock = async () => {
    if (!stockToDelete?.id) return;

    try {
      const response = await stockApi.delete(stockToDelete.id.toString());
      if (response.success) {
        setStocks(stocks.filter((item) => item.id !== stockToDelete.id));
        toast.success(
          response.message || "Đã xóa thông tin tồn kho thành công"
        );
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || "Không thể xóa dữ liệu");
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Đã xảy ra lỗi khi xóa dữ liệu");
    } finally {
      setIsDeleteDialogOpen(false);
      setStockToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    fetchStocks();
    setOpenForm(false);
    if (onSuccess) onSuccess();
  };

  const columns = getProductColorColumns({
    onEdit: handleEditStock,
    onDelete: (stock) => {
      setStockToDelete(stock);
      setIsDeleteDialogOpen(true);
    },
  });

  return (
    <div className="space-y-4">
      <StockForm
        open={openForm}
        setOpen={setOpenForm}
        productItemId={String(productItem?.id) || ""}
        onSuccess={handleFormSuccess}
        itemToEdit={editingStock}
        isEdit={isEdit}
        productColors={productColors}
      />

      <ConfirmModal
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa thông tin tồn kho"
        description={`Bạn có chắc chắn muốn xóa thông tin tồn kho cho màu ${
          stockToDelete?.product_colors?.color_name || ""
        } không?`}
        onConfirm={handleDeleteStock}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Quản lý tồn kho</h2>
        <Button
          onClick={handleAddStock}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <i className="bi bi-plus mr-1"></i>
          Thêm tồn kho
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={stocks}
        loading={isLoading}
        emptyState={
          <div className="text-center py-8">
            <i className="bi bi-box text-4xl text-gray-300"></i>
            <p className="mt-2 text-gray-500">
              Chưa có thông tin tồn kho cho sản phẩm này
            </p>
            <Button onClick={handleAddStock} variant="outline" className="mt-4">
              Thêm tồn kho
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default StockTable;
