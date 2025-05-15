"use client";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { ApiResponse } from "@/libs/api-response";

export interface DataTableOptions<T> {
  apiService: {
    getAll: (params?: any) => Promise<ApiResponse<T[]>>;
    delete: (id: string) => Promise<ApiResponse<any>>;
  };
  defaultPageSize?: number;
  searchDebounceTime?: number;
}

export function useDataTable<T>({
  apiService,
  defaultPageSize = 10,
  searchDebounceTime = 500,
}: DataTableOptions<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[] | null>(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<T | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async (params?: {
    keyword?: string;
    page?: number;
    pageSize?: number;
  }) => {
    try {
      setLoading(true);
      const response = await apiService.getAll({
        keyword: params?.keyword,
        page: params?.page || page,
        pageSize: params?.pageSize || pageSize,
      });

      if (response.success === true) {
        setData(response.data);
        if (response.pagination) {
          setPage(response.pagination.page || 1);
          setPageSize(response.pagination.pageSize || 10);
          setTotal(response.pagination.total || 0);
          setTotalPages(response.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchData({ keyword: query });
    }, searchDebounceTime),
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  // Trigger search on query change
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      fetchData();
    }
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData({ keyword: searchQuery });
  };

  const handleEdit = (item: T) => {
    setItemToEdit(item);
    setIsEditMode(true);
    setIsOpenForm(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsEditMode(false);
    setIsOpenForm(true);
  };

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setIsOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      const response = await apiService.delete(itemToDelete.id.toString());
      if (response.success) {
        fetchData({ keyword: searchQuery });
        toast.success(response.message || "Xóa thành công.");
      } else {
        toast.error(response.message || "Xóa thất bại.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsOpenConfirmModal(false);
      setItemToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchData({
      keyword: searchQuery,
      page: newPage,
      pageSize,
    });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
    fetchData({
      keyword: searchQuery,
      page: 1,
      pageSize: newSize,
    });
  };

  return {
    // Data
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

    // Handlers
    setIsOpenForm,
    setIsOpenConfirmModal,
    handleSearchChange,
    handleSearch,
    handleEdit,
    handleAddNew,
    handleDelete,
    confirmDelete,
    handlePageChange,
    handlePageSizeChange,
    fetchData,
  };
}
