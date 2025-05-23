"use client";

import { Button } from "@/components/ui-shadcn/button";
import * as React from "react";
import { toast } from "react-hot-toast";
import FormActions from "@/components/ui-custom/form-actions";

import {
  CategoryInputType,
  categoryInputSchema,
  CategoryType,
} from "@/schemas";
import { generateSlug } from "@/libs/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryApi } from "@/apis";
import { Form } from "@/components/ui-shadcn/form";
import { useEffect, useState, useMemo } from "react";
import CustomInput from "@/components/ui-custom/input-custom";
import SelectWithSearch from "@/components/ui-custom/select-with-search";
import SimpleModal from "@/components/ui-custom/simple-modal";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: CategoryType | null;
  onSuccess?: () => void;
  editMode?: boolean;
};

const CategoryFormModal = ({
  open,
  setOpen,
  itemToEdit,
  onSuccess,
  editMode = false,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingParents, setLoadingParents] = useState(false);
  const [parentCategories, setParentCategories] = useState<CategoryType[]>([]);

  const defaultValues = {
    name: "",
    slug: "",
    parent_id: null,
  };

  // Fetch parent categories when form opens
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

  // Prepare parent categories options, excluding the current category if editing
  const parentCategoryOptions = useMemo(() => {
    const options = [];

    // Add empty option
    options.push({ value: "", label: "Không có danh mục cha" });

    // Add all parent categories, excluding the current one if we're editing
    parentCategories.forEach((cat) => {
      // Skip if this is the category we're currently editing
      if (editMode && itemToEdit && cat.id === itemToEdit.id) {
        return;
      }

      options.push({
        value: cat.id.toString(),
        label: cat.name,
      });
    });

    return options;
  }, [parentCategories, itemToEdit, editMode]);

  const form = useForm<CategoryInputType>({
    resolver: zodResolver(categoryInputSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (editMode && itemToEdit) {
      form.reset({
        name: itemToEdit.name || "",
        slug: itemToEdit.slug || "",
        parent_id: itemToEdit.parent_id || null,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editMode, itemToEdit, form]);

  const onSubmit = async (data: CategoryInputType) => {
    try {
      setLoading(true);
      if (editMode && itemToEdit) {
        const response = await categoryApi.update(
          itemToEdit.id.toString(),
          data
        );
        if (response.success) {
          toast.success(response.message || "Cập nhật thành công.");
          setOpen(false);
        } else {
          toast.error(response.message || "Lỗi cập nhật.");
        }
      } else {
        const response = await categoryApi.create(data);
        if (response.success) {
          toast.success(response.message || "Thêm thành công.");
          setOpen(false);
        } else {
          toast.error(response.message || "Lỗi thêm.");
        }
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi không mong muốn.");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    form.setValue("slug", generateSlug(value));
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={editMode ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      className="max-w-xl bg-white min-h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <CustomInput
            control={form.control}
            name="name"
            label="Tên danh mục"
            placeholder="VD: iPhone, iPad, MacBook..."
            className="col-span-1"
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={loading}
          />

          <CustomInput
            control={form.control}
            name="slug"
            label="Slug"
            placeholder="VD: iphone, ipad, macbook..."
            className="col-span-1"
            disabled={loading}
          />

          <SelectWithSearch
            control={form.control}
            name="parent_id"
            label="Danh mục cha"
            options={parentCategoryOptions}
            title="Chọn danh mục cha"
            placeholder={loadingParents ? "Đang tải..." : "Chọn danh mục cha"}
            className="col-span-2"
            isNumeric={true}
            disabled={loading || loadingParents}
          />

          <FormActions
            loading={loading || loadingParents}
            onCancel={() => setOpen(false)}
            showCancel={true}
          />
        </form>
      </Form>
    </SimpleModal>
  );
};

export default CategoryFormModal;
