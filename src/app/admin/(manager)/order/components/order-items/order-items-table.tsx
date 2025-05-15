"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui-shadcn/button";
import ConfirmModal from "@/components/ui-custom/confirm-modal";
import { OrderType, OrderItemType } from "@/schemas";
import OrderItemForm from "./order-item-form";
import { orderItemApi } from "@/apis";
import { DataTable } from "@/components/ui-custom/table";
import { getOrderItemColumns } from "./column";

interface Props {
  order: OrderType | null;
  onSuccess?: () => void;
}

const OrderItemsTable = ({ order, onSuccess }: Props) => {
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItemType | null>(null);
  const [itemToDelete, setItemToDelete] = useState<OrderItemType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const fetchOrderItems = async () => {
    try {
      setIsLoading(true);
      if (!order?.id) return;
      const response = await orderItemApi.getAll({
        orderId: String(order.id),
      });

      if (response.success && response.data) {
        setOrderItems(response.data);
      } else {
        toast.error("Không thể tải dữ liệu mục đơn hàng");
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (order?.id) {
      fetchOrderItems();
    }
  }, [order]);

  const handleAddItem = () => {
    setEdit(false);
    setEditingItem(null);
    setOpenForm(true);
  };

  const handleEditItem = (item: OrderItemType) => {
    setEdit(true);
    setEditingItem(item);
    setOpenForm(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;

    try {
      const response = await orderItemApi.delete(itemToDelete.id.toString());
      if (response.success) {
        setOrderItems(orderItems.filter((item) => item.id !== itemToDelete.id));
        toast.success(response.message || "Đã xóa mục đơn hàng thành công");
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || "Không thể xóa dữ liệu");
      }
    } catch (error) {
      console.error("Error deleting order item:", error);
      toast.error("Đã xảy ra lỗi khi xóa dữ liệu");
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    fetchOrderItems();
    setOpenForm(false);
    if (onSuccess) onSuccess();
  };

  const columns = getOrderItemColumns({
    onEdit: handleEditItem,
    onDelete: (item) => {
      setItemToDelete(item);
      setIsDeleteDialogOpen(true);
    },
  });

  return (
    <div className="space-y-4">
      <OrderItemForm
        open={openForm}
        setOpen={setOpenForm}
        orderId={String(order?.id) || ""}
        onSuccess={handleFormSuccess}
        itemToEdit={editingItem}
        isEdit={edit}
      />

      <ConfirmModal
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa mục đơn hàng"
        description={`Bạn có chắc chắn muốn xóa mục đơn hàng này không?`}
        onConfirm={handleDeleteItem}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Danh sách sản phẩm trong đơn hàng
        </h2>
        <Button
          onClick={handleAddItem}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <i className="bi bi-plus mr-1"></i>
          Thêm sản phẩm
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={orderItems || []}
        loading={isLoading}
        emptyState={
          <div className="text-center py-8">
            <i className="bi bi-box text-4xl text-gray-300"></i>
            <p className="mt-2 text-gray-500">
              Chưa có sản phẩm nào trong đơn hàng này
            </p>
            <Button onClick={handleAddItem} variant="outline" className="mt-4">
              Thêm sản phẩm
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default OrderItemsTable;
