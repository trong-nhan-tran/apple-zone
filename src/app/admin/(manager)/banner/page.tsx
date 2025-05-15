"use client";
import { DataTablePage } from "@/components/generic/data-table-page";
import { getBannerColumns } from "./components/column";
import BannerFormModal from "./components/banner-form";
import { bannerApi } from "@/apis";

const CategoryManagerPage = () => {
  return (
    <DataTablePage
      title="Banner"
      columnsFactory={getBannerColumns}
      apiService={bannerApi}
      FormComponent={BannerFormModal}
      emptyStateMessage="Chưa có banner nào"
      searchPlaceholder="Tìm kiếm banner..."
      deleteConfirmMessage={(item) => `Xoá banner: "${item?.id || ""}"?`}
    />
  );
};

export default CategoryManagerPage;
