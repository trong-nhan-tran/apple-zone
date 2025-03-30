import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ColorType, colorSchema } from "@/types/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorService } from "@/services/color";
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
  color?: ColorType;
  onSuccess?: () => void;
};

const ColorFormModal = ({ open, setOpen, color, onSuccess }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const isEditMode = !!color;

  const form = useForm<ColorType>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  // Reset form when color changes
  React.useEffect(() => {
    if (color) {
      form.reset({
        id: color.id,
        name: color.name,
        code: color.code || "",
      });
    } else {
      form.reset({
        name: "",
        code: "",
      });
    }
  }, [color, form]);

  const onSubmit = async (data: ColorType) => {
    try {
      setLoading(true);
      let response;

      if (isEditMode && color.id) {
        response = await colorService.update(color.id.toString(), data);
        if (response.err) {
          toast.error(response.mess || "Lỗi không xác định");
          return;
        }
        toast.success("Cập nhật màu sắc thành công");
      } else {
        response = await colorService.create(data);
        if (response.err) {
          toast.error(response.mess || "Lỗi không xác định");
          return;
        }
        toast.success("Thêm màu sắc thành công");
      }

      setOpen(false);
      onSuccess?.();
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa màu sắc" : "Thêm màu sắc"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên màu sắc</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Đen, Trắng, Đỏ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã màu (HEX)</FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        placeholder="VD: #000000, #FFFFFF..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    {field.value && (
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: field.value }}
                      ></div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isEditMode ? "Cập nhật màu sắc" : "Thêm màu sắc"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ColorFormModal;
