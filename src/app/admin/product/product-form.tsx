"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, UploadCloud, Trash2 } from "lucide-react";
import {
  CategoryType,
  ColorType,
  ProductType,
  ProductImageType,
  productSchema,
  productColorImageSchema,
} from "@/types/schema";
import { imageService } from "@/services/image";
import { productService } from "@/services/product";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: CategoryType[];
  onSuccess?: () => void;
  isEdit?: boolean;
  product?: ProductType | null;
  colors: ColorType[];
};

const ProductForm = ({
  open,
  setOpen,
  categories,
  onSuccess,
  isEdit = false,
  product,
  colors = [],
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{
    [key: string]: boolean;
  }>({});

  // State to store temporary files before upload
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Tạo schema validate tùy chỉnh từ productSchema
  const customProductSchema = productSchema.refine(
    (data) => {
      // Kiểm tra các màu sắc có trùng lặp không
      const colorIds =
        data.product_color_images?.map((item) => item.color_id) || [];
      const uniqueColorIds = new Set(colorIds);

      // Nếu số lượng colorIds và uniqueColorIds khác nhau thì có trùng lặp
      return colorIds.length === uniqueColorIds.size;
    },
    {
      message: "Mỗi màu sắc chỉ được sử dụng một lần",
      path: ["product_color_images"], // Path để hiển thị lỗi
    }
  );

  const defaultValuesForm = {
    name: "",
    thumbnail: "",
    category_id: categories[0]?.id || null,
    product_color_images: [
      {
        color_id: colors[0]?.id || 1,
        urls: [],
        new_images: [] as (string | File)[],
      },
    ],
  };

  const form = useForm<ProductType>({
    resolver: zodResolver(customProductSchema), // Sử dụng resolver với schema tùy chỉnh
    defaultValues: defaultValuesForm,
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form; // Thêm errors từ formState
  const deletedImagesRef = useRef<string[]>([]);

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset(product);
    } else {
      form.reset(defaultValuesForm);
    }
  }, [product, categories, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "product_color_images",
  });

  const handleAddColor = () => {
    // Find first unused color or default to first color
    const usedColorIds = (watch("product_color_images") ?? []).map(
      (item) => item.color_id
    );
    const availableColor =
      colors.find(
        (color) => color.id !== undefined && !usedColorIds.includes(color.id)
      ) || colors[0];

    // Nếu tất cả màu đã được sử dụng, hiển thị thông báo
    if (usedColorIds.length >= colors.length) {
      toast.error("Đã sử dụng hết tất cả các màu sắc có sẵn");
      return;
    }

    append({
      color_id: availableColor?.id || 1,
      product_id: null,
      urls: [],
      new_images: [],
    });
  };

  const handleDeleteColor = (index: number) => {
    const productColorImages = watch("product_color_images");
    // Add current URLs to deleted images list
    if ((productColorImages ?? [])[index]?.urls?.length ?? 0 > 0) {
      if (
        productColorImages &&
        Array.isArray(productColorImages[index]?.urls)
      ) {
        deletedImagesRef.current.push(...productColorImages[index].urls);
      }
    }
    remove(index);
  };

  const handleDeleteImage = (
    colorIndex: number,
    imageIndex: number,
    isNewImage: boolean
  ) => {
    const productColorImages = [...(watch("product_color_images") || [])];

    if (isNewImage) {
      // Remove from new_images array
      productColorImages[colorIndex].new_images?.splice(imageIndex, 1);
    } else {
      // Track the deleted URL and remove from urls array
      const deletedUrl =
        productColorImages[colorIndex].urls?.[imageIndex] ?? "";
      deletedImagesRef.current.push(deletedUrl);
      productColorImages[colorIndex].urls?.splice(imageIndex, 1);
    }

    setValue("product_color_images", productColorImages);
  };

  const handleColorImagesSelect = async (
    files: FileList | null,
    colorIndex: number
  ) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const productColorImages = [...(watch("product_color_images") || [])];

    // Add selected files to new_images
    if (!productColorImages[colorIndex].new_images) {
      productColorImages[colorIndex].new_images = [];
    }

    productColorImages[colorIndex].new_images = [
      ...(productColorImages[colorIndex].new_images || []),
      ...fileArray,
    ] as (string | File)[];

    setValue("product_color_images", productColorImages);
  };

  const handleThumbnailSelect = (file: File) => {
    setThumbnailFile(file);

    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setValue("thumbnail", previewUrl);
  };

  const handleRemoveThumbnail = () => {
    if (product?.thumbnail) {
      deletedImagesRef.current.push(product.thumbnail);
    }
    setThumbnailFile(null);
    setValue("thumbnail", "");
  };

  const onSubmit = async (data: ProductType) => {
    try {
      setIsSubmitting(true);

      // Upload thumbnail if exists
      let thumbnailUrl = data.thumbnail;
      if (thumbnailFile) {
        // Kiểm tra xem thumbnailFile có phải là File thực sự không
        if (thumbnailFile instanceof File) {
          const uploadResult = await imageService.upload(
            thumbnailFile,
            "thumbnails"
          );
          thumbnailUrl = Array.isArray(uploadResult)
            ? uploadResult[0]
            : uploadResult;
          setValue("thumbnail", thumbnailUrl);

          // Cập nhật luôn trong object data để đảm bảo dữ liệu gửi đi là URL thực
          data.thumbnail = thumbnailUrl;
        }
      }

      // Process color images
      let updatedColorImages = [...(data.product_color_images || [])];

      for (let i = 0; i < updatedColorImages.length; i++) {
        const colorData = updatedColorImages[i];
        const newImageFiles = colorData.new_images || [];

        if (newImageFiles.length > 0) {
          setUploadingImages((prev) => ({ ...prev, [i]: true }));

          // Upload tất cả file mới sử dụng service đúng cách
          // Chuyển đổi newImageFiles thành mảng File thực sự
          const filesToUpload = newImageFiles.filter(
            (file) => file instanceof File
          ) as File[];

          if (filesToUpload.length > 0) {
            // Upload nhiều file cùng lúc
            const uploadedUrls = await imageService.upload(
              filesToUpload,
              "products"
            );

            // Đảm bảo uploadedUrls luôn là mảng
            const urlsArray = Array.isArray(uploadedUrls)
              ? uploadedUrls
              : [uploadedUrls];

            // Combine với URLs hiện tại
            updatedColorImages[i].urls = [
              ...(updatedColorImages[i].urls || []),
              ...urlsArray,
            ];
          }

          // Clear new images
          updatedColorImages[i].new_images = [];

          setUploadingImages((prev) => ({ ...prev, [i]: false }));
        }
      }

      // Xóa các ảnh đã bị xóa trong quá trình chỉnh sửa
      if (deletedImagesRef.current.length > 0) {
        // Extract paths từ URLs
        const pathsToDelete = deletedImagesRef.current
          .map((url) => imageService.extractPathFromUrl(url))
          .filter((path) => path !== null) as string[];

        if (pathsToDelete.length > 0) {
          await imageService.delete(pathsToDelete);
        }
      }

      // Save product data
      const saveData = {
        ...data,
        product_color_images: updatedColorImages,
      };

      if (isEdit && product?.id) {
        await productService.update(product.id, saveData);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await productService.create(saveData);
        toast.success("Thêm sản phẩm thành công");
      }

      // Reset deleted images reference
      deletedImagesRef.current = [];

      // Call success callback
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi khi lưu sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Cập nhật dòng sản phẩm" : "Thêm dòng sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(
                (data) => {
                  console.log("Form validation succeeded:", data);
                  onSubmit(data);
                },
                (errors) => {
                  console.error("Form validation failed:", errors);
                  console.log("Current form values:", form.getValues());
                  console.log(
                    "Detailed validation errors:",
                    form.formState.errors
                  );
                }
              )();
            }}
            className="space-y-6"
          >
            <div className="flex space-x-4">
              <div className="w-full pr-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên dòng sản phẩm</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên dòng sản phẩm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          // Convert the string value back to number before saving to form state
                          field.onChange(Number(value));
                        }}
                        defaultValue={
                          field.value !== null ? String(field.value) : undefined
                        }
                        value={
                          field.value !== null ? String(field.value) : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn danh mục">
                              {
                                categories.find((cat) => cat.id === field.value)
                                  ?.name
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh đại diện</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        {field.value ? (
                          <div className="relative w-28 h-28 border rounded-md overflow-hidden group">
                            <img
                              src={field.value}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={handleRemoveThumbnail}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Label
                            htmlFor="thumbnail-upload"
                            className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center p-2 text-center">
                              <UploadCloud className="h-6 w-6 mb-2 text-gray-500" />
                              <p className="text-xs text-gray-500">Chọn ảnh</p>
                            </div>
                            <Input
                              id="thumbnail-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleThumbnailSelect(file);
                              }}
                            />
                          </Label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Màu sắc và hình ảnh</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddColor}
                  disabled={fields.length >= colors.length} // Disable nếu đã dùng hết màu
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm màu
                </Button>
              </div>

              {/* Hiển thị lỗi trùng màu (nếu có) */}
              {errors.product_color_images?.message && (
                <div className="text-red-500 text-sm">
                  {errors.product_color_images.message}
                </div>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Màu #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteColor(index)}
                        className="text-red-500 h-8 px-2"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`product_color_images.${index}.color_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn màu</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            // Kiểm tra trùng màu khi chọn
                            const colorId = Number(value);
                            const currentColors =
                              watch("product_color_images")?.map(
                                (item) => item.color_id
                              ) || [];

                            // Loại bỏ màu hiện tại khỏi mảng kiểm tra
                            const otherColors = [...currentColors];
                            otherColors.splice(index, 1);

                            // Kiểm tra xem màu đã tồn tại chưa
                            if (otherColors.includes(colorId)) {
                              // Báo lỗi nhưng vẫn set giá trị để trigger lỗi validation
                              field.onChange(colorId);

                              // Đặt lỗi tùy chỉnh cho trường này
                              form.setError(
                                `product_color_images.${index}.color_id`,
                                {
                                  type: "manual",
                                  message: "Màu này đã được sử dụng ở màu khác",
                                }
                              );

                              return;
                            }

                            // Xóa lỗi nếu có
                            form.clearErrors(
                              `product_color_images.${index}.color_id`
                            );
                            field.onChange(colorId);
                          }}
                          defaultValue={String(field.value)}
                          value={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn màu">
                                <div className="flex items-center gap-2">
                                  {
                                    colors.find((c) => c.id === field.value)
                                      ?.name
                                  }
                                  {colors.find((c) => c.id === field.value)
                                    ?.code && (
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{
                                        backgroundColor:
                                          colors.find(
                                            (c) => c.id === field.value
                                          )?.code || "",
                                      }}
                                    />
                                  )}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colors.map((color) => (
                              <SelectItem
                                key={color.id}
                                value={String(color.id)}
                              >
                                <div className="flex items-center gap-2">
                                  {color.name}
                                  <div
                                    className="w-4 h-4 rounded-full border"
                                    style={{
                                      backgroundColor: color.code || "",
                                    }}
                                  />
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Color Images Upload */}
                  <FormField
                    control={form.control}
                    name={`product_color_images.${index}.urls`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hình ảnh</FormLabel>
                        <FormControl>
                          <div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                              {/* Existing images */}
                              {Array.isArray(field.value) &&
                                field.value.map((url, imageIndex) => (
                                  <div
                                    key={imageIndex}
                                    className="relative w-28 h-28 border rounded-md overflow-hidden group"
                                  >
                                    <img
                                      src={url}
                                      alt={`Image ${imageIndex + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() =>
                                          handleDeleteImage(
                                            index,
                                            imageIndex,
                                            false
                                          )
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}

                              {/* New images preview */}
                              {watch(
                                `product_color_images.${index}.new_images`
                              )?.map((file, imageIndex) => (
                                <div
                                  key={`new-${imageIndex}`}
                                  className="relative w-28 h-28 border rounded-md overflow-hidden group"
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`New Image ${imageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteImage(
                                          index,
                                          imageIndex,
                                          true
                                        )
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                              {/* Add image button */}
                              <Label
                                htmlFor={`upload-images-color-${index}`}
                                className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                              >
                                <div className="flex flex-col items-center justify-center p-2 text-center">
                                  <UploadCloud className="h-6 w-6 mb-2 text-gray-500" />
                                  <p className="text-xs text-gray-500">
                                    Thêm ảnh
                                  </p>
                                </div>
                                <Input
                                  id={`upload-images-color-${index}`}
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleColorImagesSelect(
                                      e.target.files,
                                      index
                                    )
                                  }
                                />
                              </Label>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Đang xử lý...</>
                ) : isEdit ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
