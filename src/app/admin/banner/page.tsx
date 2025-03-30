"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { categoryService } from "@/services/category";
import { bannerService } from "@/services/banner";
import { BannerImageType, CategoryType } from "@/types/schema";
import React, { useEffect, useState } from "react";
import BannerForm from "./banner-form";
import { toast } from "react-toastify";

const BannerPage = () => {
  const [banners, setBanners] = useState<BannerImageType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [bannerToEdit, setBannerToEdit] = useState<BannerImageType | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<BannerImageType | null>(
    null
  );
  const [openFormBanner, setOpenFormBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await bannerService.getAll();
      if (response.err === false && response.data) {
        setBanners(response.data);
      } else {
        toast.error("Không thể tải danh sách banner");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Không thể tải danh sách banner");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.err === false && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchCategories();
  }, []);

  const handleDeleteBanner = async () => {
    if (!bannerToDelete?.id) return;

    try {
      const response = await bannerService.delete(bannerToDelete.id.toString());
      if (response.err === false) {
        setBanners(banners.filter((banner) => banner.id !== bannerToDelete.id));
        toast.success("Đã xóa banner thành công");
      } else {
        toast.error(response.mess || "Không thể xóa banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Không thể xóa banner");
    } finally {
      setIsDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter banners based on searchKeyword
    // This could be implemented if needed
  };

  return (
    <div className="">
      <BannerForm
        open={openFormBanner}
        setOpen={setOpenFormBanner}
        banner={bannerToEdit}
        categories={categories}
        onSuccess={() => {
          fetchBanners();
          setOpenFormBanner(false);
        }}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa banner</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBanner}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="sm:flex justify-between items-center my-5">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Quản lý Banner</h1>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              placeholder="Tìm kiếm"
              className="max-w-sm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button type="submit">
              <i className="bi bi-search"></i>
            </Button>
          </form>

          <Button
            type="button"
            onClick={() => {
              setBannerToEdit(null);
              setOpenFormBanner(true);
            }}
            className="bg-blue-500 hover:bg-blue-300"
          >
            <i className="bi bi-plus mr-1"></i>
            <span>Thêm banner</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="bi bi-inbox text-4xl"></i>
          <p className="mt-2">Không tìm thấy banner nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left font-medium text-gray-900">
                  Hình ảnh
                </th>
                <th className="px-4 py-4 text-left font-medium text-gray-900">
                  Danh mục
                </th>
                <th className="px-4 py-4 text-left font-medium text-gray-900">
                  Link đến
                </th>
                <th className="px-4 py-4 text-left font-medium text-gray-900">
                  Ngày tạo
                </th>
                <th className="px-4 py-4 text-right font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="h-16 w-32 overflow-hidden rounded-md">
                      <img
                        src={banner.url}
                        alt="Banner"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {banner.categories?.name || "Không có"}
                  </td>
                  <td className="px-4 py-4">
                    {banner.direct_link ? (
                      <a
                        href={banner.direct_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block max-w-[200px]"
                      >
                        {banner.direct_link}
                      </a>
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {banner.created_at
                      ? new Date(banner.created_at).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <ButtonWithTooltip
                        type="button"
                        tooltip="Chỉnh sửa"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBannerToEdit(banner);
                          setOpenFormBanner(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        type="button"
                        tooltip="Xóa"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setBannerToDelete(banner);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </ButtonWithTooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BannerPage;
