"use client";
import { DataTablePage } from "@/components/generic/data-table-page";
import { getOrderColumns } from "./components/columns";
import OrderFormModal from "./components/order-form";
import { orderApi } from "@/apis";

const OrderManagerPage = () => {
  return (
    <DataTablePage
      title="Đơn hàng"
      columnsFactory={getOrderColumns}
      apiService={orderApi}
      FormComponent={OrderFormModal}
      emptyStateMessage="Chưa có đơn hàng nào"
      searchPlaceholder="Tìm kiếm đơn hàng theo tên, email, số điện thoại..."
      deleteConfirmMessage={(item) => 
        `Xoá đơn hàng: #${item?.id || ""} của ${item?.customer_name || ""}?`
      }
    />
  );
};

export default OrderManagerPage;