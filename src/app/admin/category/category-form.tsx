import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { CategoryType, categorySchema } from "@/types/schema";
import { generateSlug } from "@/lib/utils";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryService } from "@/services/category";
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
  category?: CategoryType;
  onSuccess?: () => void;
};

const CategoryFormModal = ({ open, setOpen, category, onSuccess }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const isEditMode = !!category;
  // console.log("Category:", category);
  // console.log("Is edit mode:", isEditMode);

  const form = useForm<CategoryType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      subcategories: [],
    },
  });

  // Reset form when category changes
  React.useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories || [],
      });
    } else {
      form.reset({
        name: "",
        slug: "",
        subcategories: [],
      });
    }
  }, [category, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subcategories",
  });

  const onSubmit = async (data: CategoryType) => {
    try {
      setLoading(true);
      let response;

      if (isEditMode && category.id) {
        console.log("Updating category with ID:", category.id);
        console.log("Data:", data);
        response = await categoryService.update(category.id.toString(), data);
        if (response.err) {
          toast.error(response.mess || "Lỗi không xác định");
          return;
        }
        toast.success("Cập nhật danh mục thành công");
      } else {
        response = await categoryService.create(data);
        if (response.err) {
          toast.error(response.mess || "Lỗi không xác định");
          return;
        }
        toast.success("Thêm danh mục thành công");
      }

      setOpen(false);
      onSuccess?.();
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    form.setValue("slug", generateSlug(value));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: iPhone, iPad, MacBook..."
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
                        placeholder="VD: iphone, ipad, macbook..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="font-medium">Danh mục con</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => append({ name: "", slug: "" })}
                >
                  <Plus className="h-3 w-3 mr-1" /> Thêm dòng
                </Button>
              </div>

              <div className="border rounded-md p-4 space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col md:flex-row gap-3 items-start md:items-center border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`subcategories.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Tên dòng</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="VD: iPhone 13, MacBook Pro..."
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  form.setValue(
                                    `subcategories.${index}.slug`,
                                    generateSlug(e.target.value)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`subcategories.${index}.slug`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Slug</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="VD: iphone-13, macbook-pro..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="md:mt-5">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(index)}
                        className="flex-none"
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={loading}>
                {isEditMode ? "Cập nhật danh mục" : "Thêm danh mục"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormModal;
