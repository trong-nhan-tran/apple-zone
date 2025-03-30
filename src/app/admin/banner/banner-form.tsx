"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BannerImageType,
  CategoryType,
  bannerImageSchema,
} from "@/types/schema";
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
import { bannerService } from "@/services/banner";
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
  banner?: BannerImageType | null;
  categories: CategoryType[];
  onSuccess?: () => void;
};

const BannerForm = ({
  open,
  setOpen,
  banner,
  categories,
  onSuccess,
}: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const deletedImageRef = useRef<string | null>(null);
  const isEditMode = !!banner;

  const form = useForm<BannerImageType>({
    resolver: zodResolver(bannerImageSchema),
    defaultValues: {
      url: "",
      category_id: null,
      direct_link: null,
    },
  });

  const { setValue } = form;

  // Reset form when banner changes
  useEffect(() => {
    if (banner) {
      form.reset({
        ...banner,
      });
    } else {
      form.reset({
        url: "",
        category_id: null,
        direct_link: null,
      });
    }
    setBannerFile(null);
    deletedImageRef.current = null;
  }, [banner, form]);

  const handleBannerSelect = (file: File) => {
    setBannerFile(file);

    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setValue("url", previewUrl);
  };

  const handleRemoveBanner = () => {
    if (banner?.url) {
      deletedImageRef.current = banner.url;
    }
    setBannerFile(null);
    setValue("url", "");
  };

  const onSubmit = async (data: BannerImageType) => {
    try {
      setIsSubmitting(true);

      // Upload banner if exists
      let bannerUrl = data.url;
      if (bannerFile) {
        const uploadResult = await imageService.upload(bannerFile, "banners");
        bannerUrl = Array.isArray(uploadResult)
          ? uploadResult[0]
          : uploadResult;
        setValue("url", bannerUrl);
        data.url = bannerUrl;
      }

      // Delete old banner if replaced
      if (deletedImageRef.current) {
        const pathToDelete = imageService.extractPathFromUrl(
          deletedImageRef.current
        );
        if (pathToDelete) {
          await imageService.delete([pathToDelete]);
        }
      }

      let response;
      if (isEditMode && banner?.id) {
        response = await bannerService.update(banner.id.toString(), data);
        if (response.err === true) {
          toast.error(response?.mess || "Lỗi không xác định");
          return;
        }
        toast.success("Cập nhật banner thành công");
      } else {
        response = await bannerService.create(data);
        if (response.err === true) {
          toast.error(response?.mess || "Lỗi không xác định");
          return;
        }
        toast.success("Thêm banner thành công");
      }

      // Reset state
      deletedImageRef.current = null;
      setBannerFile(null);

      // Close modal and refresh
      setOpen(false);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi khi lưu banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Cập nhật banner" : "Thêm banner mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Form validation errors:", errors);
            })}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh banner</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-3 items-center">
                      {field.value ? (
                        <div className="relative w-full h-48 border rounded-md overflow-hidden group">
                          <img
                            src={field.value}
                            alt="Banner"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={handleRemoveBanner}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="banner-upload"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center p-2 text-center">
                            <UploadCloud className="h-8 w-8 mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              Chọn ảnh banner
                            </p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, WEBP (Tỉ lệ 16:9 là tốt nhất)
                            </p>
                          </div>
                          <Input
                            id="banner-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBannerSelect(file);
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

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục liên kết (tùy chọn)</FormLabel>
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
              name="direct_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link trực tiếp (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.getValues().url}
              >
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

export default BannerForm;
