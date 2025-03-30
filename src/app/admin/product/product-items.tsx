"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, UploadCloud, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";

import { ProductItemType, ProductType, SubcategoryType } from "@/types/types";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: ProductType | null;
  onSuccess?: () => void;
};

// Mẫu dữ liệu mặc định cho ProductItem mới
const defaultProductItem: Partial<ProductItemType> = {
  name: "",
  slug: "",
  price: 0,
  thumbnail: "",
  subcategory: { name: "", slug: "" },
  option: [{ name: "", value: "" }],
};

const ProductItemsModal = ({ open, setOpen, product, onSuccess }: Props) => {
  const [productItems, setProductItems] = useState<ProductItemType[]>([
    {
      id: "1",
      product_id: "1",
      thumbnail: "/images/product/ip.png",
      name: "iPhone 13 128GB",
      slug: "iphone-13-128gb",
      price: 10000000,
      subcategory: { name: "iPhone 13", slug: "iphone-13" },
      option: [{ name: "Bộ nhớ", value: "128GB" }],
    },
    {
      id: "2",
      product_id: "1",
      thumbnail: "/images/product/ip.png",
      name: "iPhone 13 256GB",
      slug: "iphone-13-256gb",
      price: 10000000,
      subcategory: { name: "iPhone 13", slug: "iphone-13" },
      option: [{ name: "Bộ nhớ", value: "256GB" }],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem, setEditItem] = useState<ProductItemType | null>(null);

  // Mock data của danh mục con - trong thực tế có thể lấy từ API
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>([
    { name: "iPhone 13", slug: "iphone-13" },
    { name: "iPhone 14", slug: "iphone-14" },
    { name: "iPhone 15", slug: "iphone-15" },
  ]);

  // Form để thêm mới ProductItem
  const form = useForm<ProductItemType>({
    defaultValues: {
      ...defaultProductItem,
      product_id: product?.id || "",
      name: product?.name || "",
    } as ProductItemType,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "option",
  });

  // Cập nhật giá trị mặc định khi product thay đổi
  useEffect(() => {
    if (product) {
      if (editItem) {
        // Đang chỉnh sửa item, load giá trị vào form
        form.reset(editItem);
      } else {
        // Đang thêm mới, chỉ lấy productId và name từ product
        form.reset({
          ...defaultProductItem,
          product_id: product.id || "",
          name: product.name || "",
        } as ProductItemType);
      }
    }
  }, [product, editItem, form]);

  // Upload thumbnail
  const handleThumbnailUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.setValue("thumbnail", e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Auto-generate slug khi tên thay đổi
  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    form.setValue("slug", generateSlug(name));
  };

  // Thêm hàm để bắt đầu chỉnh sửa
  const handleStartEdit = (item: ProductItemType) => {
    setEditItem(item);
    setShowAddForm(true);
  };

  // Thêm button để huỷ chỉnh sửa
  const handleCancelEdit = () => {
    setEditItem(null);
    setShowAddForm(false);
    form.reset({
      ...defaultProductItem,
      product_id: product?.id || "",
      name: product?.name || "",
    } as ProductItemType);
  };

  // Submit form
  const onSubmit = async (data: ProductItemType) => {
    try {
      setIsSubmitting(true);

      if (editItem) {
        // Đang chỉnh sửa
        const updatedItems = productItems.map((item) =>
          item.id === editItem.id ? { ...data, id: item.id } : item
        );
        setProductItems(updatedItems);
        toast.success("Cập nhật biến thể sản phẩm thành công");
      } else {
        // Đang thêm mới
        const newItem = {
          ...data,
          id: Date.now().toString(),
        };
        setProductItems([...productItems, newItem]);
        toast.success("Thêm biến thể sản phẩm thành công");
      }

      // Reset form và UI state
      setShowAddForm(false);
      setEditItem(null);
      form.reset({
        ...defaultProductItem,
        product_id: product?.id || "",
        name: product?.name || "",
      } as ProductItemType);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error with product item:", error);
      toast.error("Có lỗi xảy ra khi xử lý biến thể sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Biến thể sản phẩm: {product?.name}</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          {!editItem && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddForm(!showAddForm)}
              className="mb-4"
            >
              {showAddForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Hủy thêm mới
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm biến thể mới
                </>
              )}
            </Button>
          )}

          {showAddForm && (
            <div className="p-4 border rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4">
                {editItem ? "Cập nhật biến thể" : "Thêm biến thể mới"}
              </h3>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Tên sản phẩm</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="iPhone 13 128GB"
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug ID</Label>
                      <Input
                        id="slug"
                        {...form.register("slug")}
                        placeholder="iphone-13-128gb"
                        readOnly
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Giá bán (VNĐ)</Label>
                      <Input
                        id="price"
                        type="number"
                        {...form.register("price", { valueAsNumber: true })}
                        placeholder="10000000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subcategory">Danh mục con</Label>
                      <Select
                        onValueChange={(value) => {
                          const selected = subcategories.find(
                            (sub) => sub.slug === value
                          );
                          if (selected) {
                            form.setValue("subcategory", selected);
                          }
                        }}
                        defaultValue=""
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục con" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((sub) => (
                            <SelectItem key={sub.slug} value={sub.slug}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Ảnh đại diện</Label>
                      <div className="flex flex-col gap-3">
                        {form.watch("thumbnail") ? (
                          <div className="relative w-28 h-28 border rounded-md overflow-hidden group">
                            <img
                              src={form.watch("thumbnail")}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => form.setValue("thumbnail", "")}
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
                                if (file) handleThumbnailUpload(file);
                              }}
                            />
                          </Label>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Tuỳ chọn</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ name: "", value: "" })}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Thêm
                        </Button>
                      </div>

                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Tên (VD: Bộ nhớ)"
                              {...form.register(`option.${index}.name`)}
                            />
                            <Input
                              placeholder="Giá trị (VD: 128GB)"
                              {...form.register(`option.${index}.value`)}
                            />
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="h-9 w-9 p-0 text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Huỷ
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Đang xử lý...</>
                    ) : editItem ? (
                      "Cập nhật"
                    ) : (
                      "Thêm mới"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr className="divide-x divide-gray-200">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  <div>Tên sản phẩm</div>
                  <div className="text-xs text-gray-500">Slug ID</div>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Ảnh đại diện
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Danh mục con
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Tuỳ chọn
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Giá
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productItems?.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 divide-x divide-gray-200"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.slug}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {item.subcategory.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      {item.option.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 text-sm"
                        >
                          <span className="font-medium text-gray-800">
                            {option.name}:
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-700">
                            {option.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {item.price.toLocaleString()}đ
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-2">
                      <ButtonWithTooltip
                        type="button"
                        tooltip="Chỉnh sửa"
                        variant="primary"
                        size="icon"
                        className="h-9 w-9 p-0"
                        onClick={() => handleStartEdit(item)}
                      >
                        <i className="bi bi-pencil"></i>
                      </ButtonWithTooltip>

                      <ButtonWithTooltip
                        type="button"
                        tooltip="Xóa"
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9 p-0"
                        onClick={() => {}}
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
      </DialogContent>
    </Dialog>
  );
};

export default ProductItemsModal;
