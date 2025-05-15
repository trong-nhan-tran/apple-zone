"use client";
import { DataTablePage } from "@/components/generic/data-table-page";
import { getProductColumns } from "./components/column";
import ProductForm from "./components/product-form";
import { productApi } from "@/apis";

const CategoryManagerPage = () => {
  return (
    <DataTablePage
      title="Dòng sản phẩm"
      columnsFactory={getProductColumns}
      apiService={productApi}
      FormComponent={ProductForm}
      emptyStateMessage="Chưa có dòng sản nào"
      searchPlaceholder="Tìm kiếm dòng sản phẩm..."
      deleteConfirmMessage={(item) =>
        `Xoá dòng sản phẩm: "${item?.name || ""}"?`
      }
    />
  );
};

export default CategoryManagerPage;
