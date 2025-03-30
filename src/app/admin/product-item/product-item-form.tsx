"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateSlug } from "@/lib/utils";
import { ProductItemType, productItemSchema, CategoryType} from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, UploadCloud } from "lucide-react";
import { imageService } from "@/services/image";
import { productItemService } from "@/services/product-item";
import { categoryService } from "@/services/category";
import { productService } from "@/services/product";
import { Combobox } from "@/components/ui-custom/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  productItem?: ProductItemType | null;
  onSuccess?: () => void;
};

const ProductItemFormModal = ({
  open,
  setOpen,
  productItem,
  onSuccess,
}: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<{ value: string; label: string }[]>(
    []
  );
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const deletedImageRef = useRef<string | null>(null);
  const isEditMode = !!productItem;

  const form = useForm<ProductItemType| any>({
    resolver: zodResolver(productItemSchema),
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      thumbnail: "",
      product_id: null,
      subcategory_id: null,
      option_name: "",
      option_value: "",
    },
  });

  const { watch, setValue } = form;
  const selectedProductId = watch("product_id");
  const selectedCategoryId = watch("category_id");

  // Fetch products and categories
  const fetchData = async () => {
    try {
      // Fetch products
      const response = await productService.getAll();

      if (response.err ===false && response.data) {
        const productOptions = response.data
          .filter((product: any) => product.id !== undefined)
          .map((product: any) => ({
            value: product.id!.toString(),
            label: product.name,
          }));
        setProducts(productOptions);
      }

      // Fetch categories
      const categoriesResponse = await categoryService.getAll();
      if (categoriesResponse.err===false && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu sản phẩm và danh mục");
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((cat: any) => cat.id === selectedCategoryId);
      if (category && category.subcategories) {
        const subcategoryOptions = category.subcategories.map((sub: any) => ({
          value: String(sub.id),
          label: sub.name,
        }));
        setSubcategories(subcategoryOptions);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId, categories]);

  // Reset form when productItem changes
  useEffect(() => {
    if (productItem) {
      console.log("Resetting form with productItem:", productItem);
      form.reset({
        ...productItem,
        product_id: productItem.product_id,
        subcategory_id: productItem.subcategory_id,
        category_id: productItem.products?.category_id || null,
      });

      // Populate subcategories based on category
      if (productItem.products?.category_id) {
        const category = categories.find(
          (cat) => cat.id === productItem.products?.category_id
        );
        if (category && category.subcategories) {
          const subcategoryOptions = category.subcategories.map((sub: any) => ({
            value: String(sub.id),
            label: sub.name,
          }));
          setSubcategories(subcategoryOptions);
        }
      }
    } else {
      form.reset({
        name: "",
        slug: "",
        price: 0,
        thumbnail: "",
        product_id: null,
        subcategory_id: null,
        option_name: "",
        option_value: "",
      });
    }
  }, [productItem, form, categories]);

  const handleNameChange = (name: string) => {
    setValue("name", name);
    setValue("slug", generateSlug(name));
  };

  const handleThumbnailSelect = (file: File) => {
    setThumbnailFile(file);

    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setValue("thumbnail", previewUrl);
  };

  const handleRemoveThumbnail = () => {
    if (productItem?.thumbnail) {
      deletedImageRef.current = productItem.thumbnail;
    }
    setThumbnailFile(null);
    setValue("thumbnail", "");
  };

  const onSubmit = async (data: ProductItemType) => {
    try {
      setIsSubmitting(true);

      // Upload thumbnail if exists
      let thumbnailUrl = data.thumbnail;
      if (thumbnailFile) {
        if (thumbnailFile instanceof File) {
          const uploadResult = await imageService.upload(
            thumbnailFile,
            "thumbnails"
          );
          thumbnailUrl = Array.isArray(uploadResult)
            ? uploadResult[0]
            : uploadResult;
          setValue("thumbnail", thumbnailUrl);
          data.thumbnail = thumbnailUrl;
        }
      }

      // Delete old thumbnail if replaced
      if (deletedImageRef.current) {
        const pathToDelete = imageService.extractPathFromUrl(
          deletedImageRef.current
        );
        if (pathToDelete) {
          await imageService.delete([pathToDelete]);
        }
      }

      let response;
      if (isEditMode && productItem?.id) {
        response = await productItemService.update(
          productItem.id.toString(),
          data
        );
        if (response.err) {
          toast.error(response.mess || "Lỗi không xác định");
          return;
        }
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        response = await productItemService.create(data);
        if (response.err) {
          toast.error(response.mess || "Lỗi không xác định");
          return;
        }
        toast.success("Thêm sản phẩm thành công");
      }

      // Reset state
      deletedImageRef.current = null;
      setThumbnailFile(null);

      // Close modal and refresh
      setOpen(false);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi khi lưu sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? "Cập nhật biến thể sản phẩm"
              : "Thêm biến thể sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                console.log("Form values (valid):", data);
                onSubmit(data);
              },
              (errors) => {
                console.log("Form validation errors:", errors);
                console.log("Form values (invalid):", form.getValues());
                // Hiển thị chi tiết lỗi (không reload trang)
                Object.entries(errors).forEach(([key, value]) => {
                  console.log(`Field ${key}:`, value);
                });
              }
            )}
            className="space-y-6"
          >
            <div className="flex space-x-4">
              <div className="w-full pr-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên biến thể sản phẩm</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: iPhone 13 128GB"
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: iphone-13-128gb"
                          {...field}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="product_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dòng sản phẩm</FormLabel>
                        <FormControl>
                          <Combobox
                            title="Chọn dòng sản phẩm"
                            options={products}
                            value={field.value ? String(field.value) : ""}
                            onChange={(value) => {
                              field.onChange(value ? Number(value) : null);
                            }}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán (VNĐ)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="VD: 19000000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <FormControl>
                        <Combobox
                          title="Chọn danh mục"
                          options={categories.map((cat) => ({
                            value: String(cat.id),
                            label: cat.name,
                          }))}
                          value={field.value ? String(field.value) : ""}
                          onChange={(value) => {
                            field.onChange(value ? Number(value) : null);
                            // Reset subcategory when category changes
                            setValue("subcategory_id", null);
                          }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategory_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục con</FormLabel>
                      <FormControl>
                        <Combobox
                          title="Chọn danh mục con"
                          options={subcategories}
                          value={field.value ? String(field.value) : ""}
                          onChange={(value) => {
                            field.onChange(value ? Number(value) : null);
                          }}
                          className="w-full"
                          disabled={
                            !selectedCategoryId || subcategories.length === 0
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="option_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên tuỳ chọn</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: Dung lượng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá trị tuỳ chọn</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: 128GB" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                          <div className="relative w-32 h-32 border rounded-md overflow-hidden group">
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
                          <label
                            htmlFor="thumbnail-upload"
                            className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Đang xử lý..."
                  : isEditMode
                  ? "Cập nhật"
                  : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductItemFormModal;
