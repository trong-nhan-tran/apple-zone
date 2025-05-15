"use client";
import { DataTablePage } from "@/components/generic/data-table-page";
import { getCategoryColumns } from "./components/column";
import CategoryFormModal from "./components/category-form";
import { categoryApi } from "@/apis";

const CategoryManagerPage = () => {
  return (
    <DataTablePage
      title="Danh mục"
      columnsFactory={getCategoryColumns}
      apiService={categoryApi}
      FormComponent={CategoryFormModal}
      emptyStateMessage="Chưa có danh mục nào"
      searchPlaceholder="Tìm kiếm danh mục..."
      deleteConfirmMessage={(item) => `Xoá danh mục: "${item?.name || ""}"?`}
    />
  );
};

export default CategoryManagerPage;
