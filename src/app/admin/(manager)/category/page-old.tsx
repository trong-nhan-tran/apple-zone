"use client";

import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { debounce } from "lodash";

import { TableHeader } from "@/components/ui-custom/table-header";
import { getCategoryColumns } from "./components/column";
import { DataTable } from "@/components/ui-custom/table";
import { Pagination } from "@/components/ui-custom/pagination";

import CategoryFormModal from "./components/category-form";
import ConfirmModal from "@/components/ui-custom/confirm-modal";

import { categoryApi } from "@/apis";
import { CategoryType } from "@/schemas";

const CategoryManagerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[] | null>(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Add pagination state variables
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCategories = async (params?: {
    keyword?: string;
    page?: number;
    pageSize?: number;
  }) => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll({
        keyword: params?.keyword,
        page: params?.page || page,
        pageSize: params?.pageSize || pageSize,
      });
      if (response.success === true) {
        setCategories(response.data);
        if (response.pagination) {
          // Correctly map pagination values from the response
          setPage(response.pagination.page || 1);
          setPageSize(response.pagination.pageSize || 10);
          setTotal(response.pagination.total || 0);
          setTotalPages(response.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchCategories({ keyword: query });
    }, 500),
    []
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  // Trigger search on query change
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      // If search query is empty, fetch all categories
      fetchCategories();
    }
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCategories({ keyword: searchQuery });
  };

  const handleEdit = (category: CategoryType) => {
    setCategoryToEdit(category);
    setIsEditMode(true);
    setIsOpenForm(true);
  };

  const handleAddNew = () => {
    setCategoryToEdit(null);
    setIsEditMode(false);
    setIsOpenForm(true);
  };

  const handleDeleteCategory = (category: any) => {
    setCategoryToDelete(category);
    setIsOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await categoryApi.delete(categoryToDelete.id);
      if (response.success) {
        fetchCategories({ keyword: searchQuery });
        toast.success(response.message || "Xóa thành công.");
      } else {
        toast.error(response.message || "Xóa thất bại.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsOpenConfirmModal(false);
      setCategoryToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchCategories({
      keyword: searchQuery,
      page: newPage,
      pageSize,
    });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
    fetchCategories({
      keyword: searchQuery,
      page: 1,
      pageSize: newSize,
    });
  };

  const columns = getCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDeleteCategory,
  });

  return (
    <div className="flex flex-col h-full">
      <CategoryFormModal
        open={isOpenForm}
        setOpen={setIsOpenForm}
        itemToEdit={categoryToEdit}
        onSuccess={() => fetchCategories({ keyword: searchQuery })}
        editMode={isEditMode}
      />

      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onOpenChange={setIsOpenConfirmModal}
        title="Xác nhận"
        description={`Xoá danh mục: "${categoryToDelete?.name || ""}"?`}
        onConfirm={confirmDelete}
        confirmButtonClassName="bg-red-500 hover:bg-red-600"
      />

      <TableHeader
        title="Danh mục"
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
      />

      <DataTable
        columns={columns}
        data={categories || []}
        loading={loading}
        emptyState={
          <div className="text-center py-8">
            <i className="bi bi-folder text-4xl text-gray-300"></i>
            <p className="mt-2 text-gray-500">
              {searchQuery
                ? "Không tìm thấy danh mục nào phù hợp"
                : "Chưa có danh mục nào"}
            </p>
          </div>
        }
      />

      {!loading && categories && categories.length > 0 && (
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
};

export default CategoryManagerPage;
