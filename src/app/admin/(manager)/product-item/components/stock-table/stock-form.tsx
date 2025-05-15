"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Form } from "@/components/ui-shadcn/form";
import { Button } from "@/components/ui-shadcn/button";
import SimpleModal from "@/components/ui-custom/simple-modal";
import { stockApi } from "@/apis";
import { StockInputType, StockWithDetails } from "@/schemas";
import { stockInputSchema } from "@/schemas/stock-schema";
import SelectWithSearch from "@/components/ui-custom/select-with-search";
import CustomInput from "@/components/ui-custom/input-custom";

type StockFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  productItemId: string;
  itemToEdit?: StockWithDetails | null;
  productColors: any[];
};

const StockForm = ({
  open,
  setOpen,
  onSuccess,
  isEdit = false,
  productItemId,
  itemToEdit,
  productColors,
}: StockFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<StockInputType>({
    resolver: zodResolver(stockInputSchema),
    defaultValues: {
      product_color_id: 0,
      product_item_id: parseInt(productItemId) || 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (itemToEdit && isEdit) {
      form.reset({
        product_color_id: itemToEdit.product_color_id || undefined,
        product_item_id: itemToEdit.product_item_id || undefined,
        stock: itemToEdit.stock || undefined,
      });
    } else {
      form.reset({
        product_color_id: 0,
        product_item_id: parseInt(productItemId) || 0,
        stock: 0,
      });
    }
  }, [itemToEdit, productItemId, form, isEdit]);

  const onSubmit = async (data: StockInputType) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      // Ensure product_item_id is set correctly
      data.product_item_id = parseInt(productItemId);

      // Chuyển đổi stock từ string sang number nếu cần
      if (typeof data.stock === "string") {
        data.stock = parseInt(data.stock);
      }

      let response;
      if (isEdit && itemToEdit) {
        response = await stockApi.update(String(itemToEdit.id), data);
      } else {
        response = await stockApi.create(data);
      }

      if (response.success) {
        toast.success(
          response.message ||
            (isEdit ? "Cập nhật tồn kho thành công" : "Thêm tồn kho thành công")
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(
          response.message ||
            (isEdit ? "Lỗi cập nhật tồn kho" : "Lỗi thêm tồn kho")
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

  // Transform product colors for the select component
  const colorOptions = productColors.map((color) => ({
    value: String(color.id),
    label: color.color_name,
  }));

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={isEdit ? "Sửa thông tin tồn kho" : "Thêm thông tin tồn kho"}
      className="max-w-md bg-white"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SelectWithSearch
            control={form.control}
            name="product_color_id"
            label="Màu sắc"
            options={colorOptions}
            isNumeric={true}
            title="Chọn màu sắc"
            isRequired={true}
          />

          <CustomInput
            control={form.control}
            name="stock"
            label="Số lượng"
            placeholder="Nhập số lượng tồn kho"
            type="number"
            isRequired={true}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : isEdit
                ? "Cập nhật"
                : "Thêm mới"}
            </Button>
          </div>
        </form>
      </Form>
    </SimpleModal>
  );
};

export default StockForm;
