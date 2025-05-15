"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Form } from "@/components/ui-shadcn/form";
import { Button } from "@/components/ui-shadcn/button";
import CustomInput from "@/components/ui-custom/input-custom";
import InputImage from "@/components/ui-custom/input-image";
import SelectWithSearch from "@/components/ui-custom/select-with-search";
import { generateSlug } from "@/libs/utils";
import {
  ProductItemType,
  ProductType,
  CategoryWithDetailType,
  productItemInputSchemaFrontend,
  ProductItemInputTypeFrontend,
} from "@/schemas";
import { categoryApi, productApi, productItemApi } from "@/apis";

type Props = {
  productItem?: ProductItemType | null;
  onSuccess?: (data: ProductItemType) => void;
  editMode?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  productId?: string;
};

export default function InfoSection({
  productItem,
  onSuccess,
  editMode = false,
  open = false,
  setOpen = () => {},
  productId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryWithDetailType[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [oldThumbnailUrl, setOldThumbnailUrl] = useState<string | null>(null);

  const defaultValues: ProductItemInputTypeFrontend = {
    name: "",
    slug: "",
    thumbnail: "",
    price: 0,
    product_id: productId ? parseInt(productId) : null,
    category_id: null,
    option_name: "",
    option_value: "",
  };

  // Form initialization
  const form = useForm<ProductItemInputTypeFrontend>({
    resolver: zodResolver(productItemInputSchemaFrontend),
    defaultValues: defaultValues,
  });

  // Fetch child categories and products when form opens
  useEffect(() => {
    if (open) {
      fetchChildCategories();
      fetchProducts();
    }
  }, [open]);

  // Reset form when editing or opening
  useEffect(() => {
    if (editMode && productItem) {
      form.reset({
        name: productItem.name || "",
        slug: productItem.slug || "",
        thumbnail: productItem.thumbnail || "",
        price: productItem.price || 0,
        product_id: productItem.product_id,
        category_id: productItem.category_id,
        option_name: productItem.option_name || "",
        option_value: productItem.option_value || "",
      });
      setOldThumbnailUrl(productItem.thumbnail || null);
    } else {
      form.reset({
        ...defaultValues,
        product_id: productId ? parseInt(productId) : null,
      });
      setOldThumbnailUrl(null);
    }
    setThumbnailFile(null);
  }, [editMode, productItem, form, productId, open]);

  // Fetch child categories
  const fetchChildCategories = async () => {
    try {
      setLoadingCategories(true);
      // Lấy danh mục con (danh mục có parent)
      const response = await categoryApi.getAllChildren();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        console.error("Failed to fetch child categories");
      }
    } catch (error) {
      console.error("Error fetching child categories:", error);
      toast.error("Lỗi khi tải danh sách danh mục con");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await productApi.getAll();
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Prepare category options
  const categoryOptions = useMemo(() => {
    const options = [];

    // Add empty option
    options.push({ value: "", label: "Chọn danh mục" });

    // Add all child categories
    categories.forEach((cat) => {
      options.push({
        value: cat.id.toString(),
        label: `${cat.name}${
          cat.categories?.name ? ` (${cat.categories.name})` : ""
        }`,
      });
    });

    return options;
  }, [categories]);

  // Prepare product options
  const productOptions = useMemo(() => {
    const options = [];

    // Add empty option
    options.push({ value: "", label: "Chọn sản phẩm" });

    // Add all products
    products.forEach((product) => {
      options.push({
        value: product.id.toString(),
        label: product.name,
      });
    });

    return options;
  }, [products]);

  // Handle form submission
  const onSubmit = async (data: ProductItemInputTypeFrontend) => {
    try {
      setLoading(true);

      let response;
      if (editMode && productItem) {
        response = await productItemApi.update(
          String(productItem.id),
          data,
          thumbnailFile,
          oldThumbnailUrl
        );
      } else {
        response = await productItemApi.create(data, thumbnailFile);
      }

      if (response.success) {
        toast.success(
          response.message ||
            (editMode ? "Cập nhật thành công" : "Thêm mới thành công")
        );

        if (onSuccess && response.data) {
          onSuccess(response.data);
        }
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Handle thumbnail file change
  const handleThumbnailChange = (file: File | null) => {
    setThumbnailFile(file);
  };

  // Handle product name change to generate slug
  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    form.setValue("slug", generateSlug(value));
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              control={form.control}
              name="name"
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm con"
              isRequired={true}
              onChange={(e) => handleNameChange(e.target.value)}
            />

            <CustomInput
              control={form.control}
              name="slug"
              label="Slug"
              placeholder="slug-san-pham"
              isRequired={true}
            />

            <SelectWithSearch
              control={form.control}
              name="product_id"
              label="Dòng sản phẩm"
              options={productOptions}
              isNumeric={true}
              title="Chọn dòng sản phẩm"
              isRequired={true}
              disabled={!!productId}
            />

            <SelectWithSearch
              control={form.control}
              name="category_id"
              label="Danh mục con"
              options={categoryOptions}
              isNumeric={true}
              title="Chọn danh mục con"
              isRequired={true}
            />

            <CustomInput
              control={form.control}
              name="option_name"
              label="Tên thuộc tính"
              placeholder="Ví dụ: Dung lượng, Kích thước,..."
              isRequired={true}
            />

            <CustomInput
              control={form.control}
              name="option_value"
              label="Giá trị thuộc tính"
              placeholder="Ví dụ: 128GB, 14 inch,..."
              isRequired={true}
            />

            <CustomInput
              control={form.control}
              name="price"
              label="Giá"
              placeholder="Nhập giá sản phẩm"
              type="number"
              isRequired={true}
            />

            <div className="md:col-span-2">
              <InputImage
                control={form.control}
                name="thumbnail"
                label="Ảnh đại diện"
                folder="product-items"
                aspectRatio="4/3"
                onFileChange={handleThumbnailChange}
                previewHeight="h-[120px]"
                previewWidth="w-[120px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {setOpen && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
            )}
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
    </div>
  );
}
