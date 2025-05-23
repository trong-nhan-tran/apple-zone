"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormActions from "@/components/ui-custom/form-actions";

import { Button } from "@/components/ui-shadcn/button";
import { Form } from "@/components/ui-shadcn/form";
import SimpleModal from "@/components/ui-custom/simple-modal";
import { toast } from "react-hot-toast";
import {
  OrderItemInputType,
  OrderItemType,
  orderItemInputSchema,
} from "@/schemas";
import { orderItemApi } from "@/apis";
import CustomInput from "@/components/ui-custom/input-custom";
import SelectWithSearch from "@/components/ui-custom/select-with-search";
import { productItemApi } from "@/apis/product-item-api";

type OrderItemFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  orderId: number;
  itemToEdit?: OrderItemType | null;
};

const OrderItemForm = ({
  open,
  setOpen,
  onSuccess,
  isEdit = false,
  orderId,
  itemToEdit,
}: OrderItemFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productItems, setProductItems] = useState<
    { value: string; label: string; data?: any }[]
  >([]);
  const [selectedProductItem, setSelectedProductItem] = useState<any>(null);
  const [availableColors, setAvailableColors] = useState<
    { value: string; label: string }[]
  >([]);

  // Form setup with validation
  const form = useForm<OrderItemInputType>({
    resolver: zodResolver(orderItemInputSchema),
    defaultValues: {
      order_id: orderId,
      product_item_id: undefined,
      product_name: "",
      quantity: 1,
      color_name: "",
      option_name: "",
      option_value: "",
      price: 0,
    },
  });

  // Fetch product items for dropdown
  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        setLoading(true);
        const response = await productItemApi.getAll({
          pageSize: 100, // Fetch a large number to show all options
        });

        if (response.success && response.data) {
          const formattedItems = response.data.map((item: any) => ({
            value: item.id.toString(),
            label: `${item.name} (${item.option_value || "Default"})`,
            data: item,
          }));
          setProductItems(formattedItems);
        }
      } catch (error) {
        console.error("Error fetching product items:", error);
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchProductItems();
    }
  }, [open]);
  // Extract colors directly from the product item data
  const extractColorsFromProductItem = (productItemData: any) => {
    if (
      !productItemData ||
      !productItemData.stocks ||
      productItemData.stocks.length === 0
    ) {
      setAvailableColors([]);
      return;
    }

    const colorOptions = productItemData.stocks
      .filter((stock: any) => stock.product_colors)
      .map((stock: any) => ({
        value: stock.product_colors.color_name,
        label: stock.product_colors.color_name,
      }));

    setAvailableColors(colorOptions);
  };

  // Handle editing an existing order item
  useEffect(() => {
    if (itemToEdit && isEdit && open) {
      // Find the product item in our loaded list
      const productItem = productItems.find(
        (item) =>
          item.value ===
          (itemToEdit.product_item_id
            ? itemToEdit.product_item_id.toString()
            : null)
      );

      if (productItem?.data) {
        setSelectedProductItem(productItem.data);

        extractColorsFromProductItem(productItem.data);
      }

      form.reset({
        order_id: itemToEdit.order_id || undefined,
        product_item_id: Number(itemToEdit.product_item_id) || undefined,
        product_name: itemToEdit.product_name,
        quantity: itemToEdit.quantity,
        color_name: itemToEdit.color_name,
        option_name: itemToEdit.option_name || undefined,
        option_value: itemToEdit.option_value || undefined,
        price: Number(itemToEdit.price),
      });
    } else {
      form.reset({
        order_id: orderId,
        product_item_id: undefined,
        product_name: "",
        quantity: 1,
        color_name: "",
        option_name: "",
        option_value: "",
        price: 0,
      });
      setSelectedProductItem(null);
      setAvailableColors([]);
    }
  }, [itemToEdit, isEdit, open, form, orderId, productItems]);

  // Handle product item selection
  const handleProductItemChange = async (productItemId: number) => {
    // Find the selected product item
    const productItem = productItems.find(
      (item) => Number(item.value) === productItemId
    );

    if (productItem?.data) {
      const item = productItem.data;
      setSelectedProductItem(item);

      // Auto-fill the form with the product details
      form.setValue("product_name", item.name);
      form.setValue("option_name", item.option_name || "");
      form.setValue("option_value", item.option_value || "");
      form.setValue("price", item.price || 0);

      // Reset color selection since product changed
      form.setValue("color_name", "");

      // Extract colors from the product item data
      extractColorsFromProductItem(item);
    }
  };

  const onSubmit = async (data: OrderItemInputType) => {
    setIsSubmitting(true);
    setLoading(true);

    console.log("Form data:", data);

    try {
      let response;
      if (isEdit && itemToEdit) {
        response = await orderItemApi.update(String(itemToEdit.id), data);
      } else {
        response = await orderItemApi.create(data);
      }

      if (response.success) {
        toast.success(
          response.message ||
            (isEdit
              ? "Cập nhật mục đơn hàng thành công"
              : "Thêm mục đơn hàng thành công")
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(
          response.message ||
            (isEdit ? "Lỗi cập nhật mục đơn hàng" : "Lỗi thêm mục đơn hàng")
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
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={isEdit ? "Sửa mục đơn hàng" : "Thêm mục đơn hàng"}
      className="max-w-2xl bg-white"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Item Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithSearch
              control={form.control}
              name="product_item_id"
              label="Sản phẩm"
              options={productItems}
              title="Chọn sản phẩm"
              placeholder="Tìm kiếm sản phẩm..."
              isRequired
              disabled={loading}
              isNumeric={true}
              onChange={(value) => handleProductItemChange(value)}
            />

            <CustomInput
              control={form.control}
              name="quantity"
              label="Số lượng"
              placeholder="Nhập số lượng"
              type="number"
              isRequired
            />
          </div>

          {/* Auto-filled product details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              control={form.control}
              name="product_name"
              label="Tên sản phẩm"
              placeholder="Tên sản phẩm"
              isRequired
            />

            <CustomInput
              control={form.control}
              name="price"
              label="Đơn giá"
              placeholder="Đơn giá"
              type="number"
              isRequired
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectWithSearch
              control={form.control}
              name="color_name"
              label="Màu sắc"
              options={availableColors}
              title="Chọn màu sắc"
              placeholder="Chọn màu sắc"
              isRequired
              disabled={loading || availableColors.length === 0}
            />

            <CustomInput
              control={form.control}
              name="option_name"
              label="Tên tùy chọn"
              placeholder="Tên tùy chọn"
            />

            <CustomInput
              control={form.control}
              name="option_value"
              label="Giá trị tùy chọn"
              placeholder="Giá trị tùy chọn"
            />
          </div>

          <FormActions
            loading={loading || isSubmitting}
            onCancel={() => setOpen(false)}
            showCancel={true}
          />
        </form>
      </Form>
    </SimpleModal>
  );
};

export default OrderItemForm;
