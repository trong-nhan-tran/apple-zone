"use client";
import React, { useMemo } from "react";
import { TableHeader } from "@/components/ui-custom/table-header";
import { DataTable } from "@/components/ui-custom/table";
import { Pagination } from "@/components/ui-custom/pagination";
import ConfirmModal from "@/components/ui-custom/confirm-modal";
import { useDataTable } from "@/hooks/useDataTable";

interface DataTablePageProps<T> {
  title: string;
  columnsFactory: (handlers: {
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
  }) => any[];
  apiService: any;
  FormComponent: React.ComponentType<any>;
  emptyStateMessage?: string;
  searchPlaceholder?: string;
  deleteConfirmMessage?: (item: T) => string;
}

export function DataTablePage<T>({
  title,
  columnsFactory, // Thay đổi từ columns sang columnsFactory
  apiService,
  FormComponent,
  emptyStateMessage = "Không có dữ liệu",
  searchPlaceholder = "Tìm kiếm...",
  deleteConfirmMessage = (item: any) => `Xóa "${item?.name || ""}"?`,
}: DataTablePageProps<T>) {
  const {
    data,
    loading,
    page,
    pageSize,
    totalPages,
    total,
    searchQuery,
    isOpenForm,
    isOpenConfirmModal,
    isEditMode,
    itemToEdit,
    itemToDelete,
    setIsOpenForm,
    setIsOpenConfirmModal,
    handleSearchChange,
    handleSearch,
    handleAddNew,
    handleEdit, // Thêm vào đây
    handleDelete, // Thêm vào đây
    confirmDelete,
    handlePageChange,
    handlePageSizeChange,
    fetchData,
  } = useDataTable<T>({ apiService });

  // Tạo columns với các handlers từ hook
  const columns = useMemo(
    () => columnsFactory({ onEdit: handleEdit, onDelete: handleDelete }),
    [columnsFactory, handleEdit, handleDelete]
  );

  return (
    <div className="flex flex-col h-full">
      <FormComponent
        open={isOpenForm}
        setOpen={setIsOpenForm}
        // Sửa tên prop từ item sang category để phù hợp với CategoryFormModal
        itemToEdit={itemToEdit}
        onSuccess={() => fetchData({ keyword: searchQuery })}
        editMode={isEditMode}
      />

      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onOpenChange={setIsOpenConfirmModal}
        title="Xác nhận"
        description={deleteConfirmMessage(itemToDelete)}
        onConfirm={confirmDelete}
        confirmButtonClassName="bg-red-500 hover:bg-red-600"
      />

      <TableHeader
        title={title}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
      />

      <DataTable
        columns={columns}
        data={data || []}
        loading={loading}
        emptyState={
          <div className="text-center py-8">
            <i className="bi bi-folder text-4xl text-gray-300"></i>
            <p className="mt-2 text-gray-500">
              {searchQuery
                ? `Không tìm thấy ${title.toLowerCase()} nào phù hợp`
                : emptyStateMessage}
            </p>
          </div>
        }
      />

      {!loading && data && data.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      )}
    </div>
  );
}
