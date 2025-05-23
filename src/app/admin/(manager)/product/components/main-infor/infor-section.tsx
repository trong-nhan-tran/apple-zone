"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";
import {
  CategoryType,
  ProductType,
  ProductInputType,
  productInputSchema,
} from "@/schemas";
import { categoryApi, productApi } from "@/apis";
import { storageService } from "@/services/storage-service";
import RichTextEditor from "./rich-text-editor";
import FormActions from "@/components/ui-custom/form-actions";

import { Form } from "@/components/ui-shadcn/form";
import { Button } from "@/components/ui-shadcn/button";
import CustomInput from "@/components/ui-custom/input-custom";
import InputImage from "@/components/ui-custom/input-image";
import SelectWithSearch from "@/components/ui-custom/select-with-search";
import { DialogFooter } from "@/components/ui-shadcn/dialog";

type Props = {
  product?: ProductType | null;
  onSuccess?: () => void;
  editMode?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export default function GeneralInfo({
  product,
  onSuccess,
  editMode = false,
  open = false,
  setOpen = () => {},
}: Props) {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [oldThumbnailUrl, setOldThumbnailUrl] = useState<string | null>(null);
  const [loadingParents, setLoadingParents] = useState(false);
  const [parentCategories, setParentCategories] = useState<CategoryType[]>([]);

  const defaultValues: ProductInputType = {
    name: "",
    thumbnail: "",
    category_id: null,
    description: "",
  };

  const form = useForm<ProductInputType>({
    resolver: zodResolver(productInputSchema),
    defaultValues: defaultValues,
  });
  useEffect(() => {
    if (open) {
      fetchParentCategories();
    }
  }, [open]);
  const fetchParentCategories = async () => {
    try {
      setLoadingParents(true);
      const response = await categoryApi.getAllParents();
      if (response.success && response.data) {
        setParentCategories(response.data);
      } else {
        console.error("Failed to fetch parent categories");
      }
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    } finally {
      setLoadingParents(false);
    }
  };
  // Reset form when product changes
  useEffect(() => {
    if (product && editMode) {
      // Store the original thumbnail URL for potential deletion
      if (product.thumbnail) {
        setOldThumbnailUrl(product.thumbnail);
      }

      form.reset({
        name: product.name,
        thumbnail: product.thumbnail || "",
        category_id: product.category_id,
        description: product.description || "",
      });
    } else {
      setOldThumbnailUrl(null);
      form.reset(defaultValues);
    }
  }, [product, parentCategories, form]);

  // Transform categories for the select component
  const categoryOptions = parentCategories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  const handleFileChange = (file: File | null) => {
    setThumbnailFile(file);
  };

  const onSubmit = async (data: ProductInputType) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      let response;

      if (editMode && product) {
        response = await productApi.update(
          String(product.id),
          data,
          thumbnailFile,
          oldThumbnailUrl
        );
      } else {
        response = await productApi.create(data, thumbnailFile);
      }

      if (response.success) {
        toast.success(
          response.message ||
            (editMode ? "Cập nhật thành công" : "Thêm thành công")
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(
          response.message || (editMode ? "Lỗi cập nhật" : "Lỗi thêm mới")
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 overflow-hidden"
      >
        <div className="sm:flex sm:gap-4">
          <div className="w-full sm:w-[500px]">
            <CustomInput
              control={form.control}
              name="name"
              label="Tên dòng sản phẩm"
              placeholder="Nhập tên dòng sản phẩm"
              isRequired={true}
            />

            <SelectWithSearch
              control={form.control}
              name="category_id"
              label="Danh mục"
              options={categoryOptions}
              isNumeric={true}
              title="Chọn danh mục"
            />

            <InputImage
              control={form.control}
              name="thumbnail"
              label="Ảnh đại diện"
              folder="thumbnails"
              onFileChange={handleFileChange}
              size="w-[300px] h-[300px]"
            />
          </div>

          <div className="w-full">
            <label className="text-sm font-medium">Mô tả sản phẩm</label>
            <RichTextEditor
              value={form.watch("description") || ""}
              onChange={(content) => form.setValue("description", content)}
              placeholder="Nhập mô tả sản phẩm..."
            />
          </div>
        </div>

        <FormActions
          loading={loading || isSubmitting}
          onCancel={() => setOpen(false)}
          showCancel={!!setOpen}
        />
      </form>
    </Form>
  );
}
