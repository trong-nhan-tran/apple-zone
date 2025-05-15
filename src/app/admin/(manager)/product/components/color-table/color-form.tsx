"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui-shadcn/button";
import { Form } from "@/components/ui-shadcn/form";
import SimpleModal from "@/components/ui-custom/simple-modal";
import { toast } from "react-hot-toast";
import {
  ProductColorInputTypeFrontend,
  ProductColorType,
  productColorInputSchemaFrontend,
} from "@/schemas";
import { productColorApi } from "@/apis";
import CustomInput from "@/components/ui-custom/input-custom";
import InputImage from "@/components/ui-custom/input-image";
import InputImageMultiple from "@/components/ui-custom/input-image-multiple";

type ColorImagesFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  productId: string;
  itemToEdit?: ProductColorType | null;
};

const ColorImagesForm = ({
  open,
  setOpen,
  onSuccess,
  isEdit = false,
  productId,
  itemToEdit,
}: ColorImagesFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [oldThumbnailUrl, setOldThumbnailUrl] = useState<string | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

  const form = useForm<ProductColorInputTypeFrontend>({
    resolver: zodResolver(productColorInputSchemaFrontend),
    defaultValues: {
      color_name: "",
      thumbnail: "",
      images: [],
      product_id: productId ? parseInt(productId) : undefined,
    },
  });

  useEffect(() => {
    if (itemToEdit && isEdit) {
      // Chuyển đổi mảng URL thông thường sang mảng đối tượng ImageFieldValue
      const formattedImages = (itemToEdit.images || []).map((url) => ({
        url,
        isNew: false,
      }));

      form.reset({
        color_name: itemToEdit.color_name,
        thumbnail: itemToEdit.thumbnail || "",
        images: formattedImages,
        product_id: itemToEdit.product_id,
      });
      setOldThumbnailUrl(itemToEdit.thumbnail);
    } else {
      form.reset({
        color_name: "",
        thumbnail: "",
        images: [],
        product_id: productId ? parseInt(productId) : undefined,
      });
      setOldThumbnailUrl(null);
    }
    setThumbnailFile(null);
    setNewImageFiles([]);
    setRemovedImageUrls([]);
  }, [itemToEdit, productId, form]);

  const onSubmit = async (data: ProductColorInputTypeFrontend) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      // Always make sure product_id is set
      const productIdNum = parseInt(productId);
      data.product_id = productIdNum;

      // Xử lý dữ liệu trước khi gửi API
      // 1. Tách ra các URL ảnh đã tồn tại (không phải ảnh mới)
      const existingImageUrls = data.images
        .filter((img) => !img.isNew)
        .map((img) => img.url);

      // 2. Lấy ra các file ảnh mới để upload
      const imagesToUpload = newImageFiles;

      let response;
      if (isEdit && itemToEdit) {
        response = await productColorApi.update(
          String(itemToEdit.id),
          // Thay đổi: Gửi images dạng array string đơn giản cho API thay vì array object
          {
            ...data,
            images: existingImageUrls,
          },
          thumbnailFile,
          oldThumbnailUrl,
          imagesToUpload.length > 0 ? imagesToUpload : null,
          removedImageUrls.length > 0 ? removedImageUrls : null
        );
      } else {
        response = await productColorApi.create(
          // Thay đổi: Gửi images dạng array string đơn giản cho API
          {
            ...data,
            images: existingImageUrls,
          },
          thumbnailFile,
          imagesToUpload.length > 0 ? imagesToUpload : null
        );
      }

      if (response.success) {
        toast.success(
          response.message ||
            (isEdit ? "Cập nhật màu sắc thành công" : "Thêm màu sắc thành công")
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(
          response.message ||
            (isEdit ? "Lỗi cập nhật màu sắc" : "Lỗi thêm màu sắc")
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

  const handleThumbnailChange = (file: File | null) => {
    setThumbnailFile(file);
  };

  const handleAdditionalImagesChange = (files: File[]) => {
    setNewImageFiles(files);
  };

  const handleRemovedImagesChange = (urls: string[]) => {
    setRemovedImageUrls(urls);
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={isEdit ? "Sửa màu sắc" : "Thêm màu sắc"}
      className="max-w-2xl bg-white"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Color Name */}
          <CustomInput
            control={form.control}
            name="color_name"
            label="Tên màu sắc"
            placeholder="Nhập tên màu sắc"
            isRequired
          />

          <InputImage
            control={form.control}
            name="thumbnail"
            label="Ảnh đại diện"
            onFileChange={handleThumbnailChange}
            folder="color-thumbnails"
            previewHeight="h-[200px]"
            previewWidth="w-[200px]"
          />

          <InputImageMultiple
            control={form.control}
            name="images"
            label="Dánh sách ảnh"
            onFilesChange={handleAdditionalImagesChange}
            onRemovedUrls={handleRemovedImagesChange}
            folder="color-images"
            previewHeight="h-[150px]"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="relative">
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <i className="bi bi-arrow-repeat animate-spin text-white"></i>
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

export default ColorImagesForm;
