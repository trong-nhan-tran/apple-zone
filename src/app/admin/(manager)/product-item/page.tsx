"use client";
import { DataTablePage } from "@/components/generic/data-table-page";
import { getProductItemColumns } from "./components/column";
import ProductItemForm from "./components/product-item-form";
import { productItemApi } from "@/apis";

const CategoryManagerPage = () => {
  return (
    <DataTablePage
      title="Sản phẩm"
      columnsFactory={getProductItemColumns}
      apiService={productItemApi}
      FormComponent={ProductItemForm}
      emptyStateMessage="Chưa có sản phẩm nào"
      searchPlaceholder="Tìm kiếm sản phẩm..."
      deleteConfirmMessage={(item) => `Xoá sản phẩm: "${item?.name || ""}"?`}
    />
  );
};

export default CategoryManagerPage;
