"use client";

import { Button } from "@/components/ui-shadcn/button";
import * as React from "react";
import { toast } from "react-hot-toast";

import {
  BannerInputType,
  bannerInputSchema,
  BannerType,
  CategoryType,
} from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerApi, categoryApi } from "@/apis";
import { Form } from "@/components/ui-shadcn/form";
import { useEffect, useState, useMemo } from "react";
import CustomInput from "@/components/ui-custom/input-custom";
import SelectWithSearch from "@/components/ui-custom/select-with-search";
import SimpleModal from "@/components/ui-custom/simple-modal";
import InputImage from "@/components/ui-custom/input-image";
import { storageService } from "@/services/storage-service";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: BannerType | null;
  onSuccess?: () => void;
  editMode?: boolean;
};

const BannerFormModal = ({
  open,
  setOpen,
  itemToEdit,
  onSuccess,
  editMode = false,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [oldBannerUrl, setOldBannerUrl] = useState<string | null>(null);

  const defaultValues: BannerInputType = {
    url: "",
    direct_link: "",
    category_id: null,
  };

  // Form initialization
  const form = useForm<BannerInputType>({
    resolver: zodResolver(bannerInputSchema),
    defaultValues,
  });

  // Fetch categories when form opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Reset form when editing or opening
  useEffect(() => {
    if (editMode && itemToEdit) {
      form.reset({
        url: itemToEdit.url || "",
        direct_link: itemToEdit.direct_link || "",
        category_id: itemToEdit.category_id || null,
      });
      setOldBannerUrl(itemToEdit.url || null);
    } else {
      form.reset(defaultValues);
      setOldBannerUrl(null);
    }
    setBannerFile(null);
  }, [editMode, itemToEdit, form]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryApi.getAllParents();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        console.error("Failed to fetch categories");
        toast.error("Không thể tải danh sách danh mục");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Lỗi khi tải danh sách danh mục");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Prepare category options
  const categoryOptions = useMemo(() => {
    const options = [];

    // Add empty option
    options.push({ value: "", label: "Không có danh mục" });

    // Add all categories
    categories.forEach((cat) => {
      options.push({
        value: cat.id.toString(),
        label: cat.name,
      });
    });

    return options;
  }, [categories]);

  // Handle form submission with image upload
  const onSubmit = async (data: BannerInputType) => {
    try {
      setLoading(true);

      // Handle image upload if a new file is selected
      if (bannerFile) {
        const uploadResponse = await storageService.upload(
          bannerFile,
          "banners"
        );
        if (!uploadResponse.success) {
          toast.error(uploadResponse.message || "Lỗi tải lên ảnh banner");
          setLoading(false);
          return;
        }

        // Update the form data with the new image URL
        data.url = uploadResponse.data as string;
      }

      // Submit the form data
      let response;
      if (editMode && itemToEdit) {
        response = await bannerApi.update(itemToEdit.id.toString(), data);

        // If update successful and we replaced the image, delete the old one
        if (
          response.success &&
          bannerFile &&
          oldBannerUrl &&
          oldBannerUrl !== data.url
        ) {
          try {
            const extractResponse =
              storageService.extractPathFromUrl(oldBannerUrl);
            if (extractResponse.success && extractResponse.data) {
              await storageService.delete(extractResponse.data);
            }
          } catch (deleteError) {
            console.error("Error deleting old banner:", deleteError);
            // Continue with the update even if banner deletion fails
          }
        }
      } else {
        response = await bannerApi.create(data);
      }

      if (response.success) {
        toast.success(
          response.message ||
            (editMode ? "Cập nhật banner thành công" : "Thêm banner thành công")
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(
          response.message ||
            (editMode ? "Lỗi cập nhật banner" : "Lỗi thêm banner")
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi không mong muốn.");
    } finally {
      setLoading(false);
    }
  };

  // Handle banner file change
  const handleBannerChange = (file: File | null) => {
    setBannerFile(file);
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={editMode ? "Chỉnh sửa banner" : "Thêm banner"}
      className="max-w-2xl bg-white min-h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Banner Image */}
          <div className="space-y-2">
            <InputImage
              control={form.control}
              name="url"
              label="Banner"
              onFileChange={handleBannerChange}
              folder="banners"
              previewHeight="h-[180px]"
              previewWidth="w-full"
            />
          </div>

          {/* Direct Link */}
          <CustomInput
            control={form.control}
            name="direct_link"
            label="Link chuyển hướng"
            placeholder="Nhập link chuyển hướng khi click vào banner"
            disabled={loading}
          />

          {/* Category Selection */}
          <SelectWithSearch
            control={form.control}
            name="category_id"
            label="Danh mục"
            options={categoryOptions}
            title="Chọn danh mục"
            placeholder={loadingCategories ? "Đang tải..." : "Chọn danh mục"}
            isNumeric={true}
            disabled={loading || loadingCategories}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              disabled={loading || loadingCategories}
              className="relative"
            >
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </span>
              )}
              <span className={loading ? "opacity-0" : ""}>Lưu</span>
            </Button>
          </div>
        </form>
      </Form>
    </SimpleModal>
  );
};

export default BannerFormModal;
