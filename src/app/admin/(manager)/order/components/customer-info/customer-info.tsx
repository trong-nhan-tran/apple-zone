"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { OrderType, OrderInputType, orderInputSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderApi } from "@/apis";
import { Form } from "@/components/ui-shadcn/form";
import CustomInput from "@/components/ui-custom/input-custom";
import SelectWithSearch from "@/components/ui-custom/select-with-search";
import { Button } from "@/components/ui-shadcn/button";
import { useAddressStore } from "@/stores/tree-address-store";

interface Props {
  order: OrderType | null;
  onSuccess?: () => void;
  editMode?: boolean;
  setOpen?: (open: boolean) => void;
  open?: boolean;
}

const CustomerInfo = ({
  order,
  onSuccess,
  editMode = false,
  setOpen,
  open,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [initialAddressLoaded, setInitialAddressLoaded] = useState(false);

  // Use the address store
  const {
    provinces,
    fetchAddressData,
    getDistrictsForProvince,
    getWardsForDistrict,
    isLoading: isAddressLoading,
  } = useAddressStore();

  // Local state for selected locations
  const [districts, setDistricts] = useState<
    { value: string; label: string }[]
  >([]);
  const [wards, setWards] = useState<{ value: string; label: string }[]>([]);

  // Load address data on component mount
  useEffect(() => {
    fetchAddressData();
  }, [fetchAddressData]);

  // Handle province change
  const handleProvinceChange = (provinceName: string) => {
    const districtsData = getDistrictsForProvince(provinceName);
    setDistricts(districtsData);
    setWards([]);

    // Only reset district and ward if not during initial loading
    if (initialAddressLoaded) {
      form.setValue("district", "");
      form.setValue("ward", "");
    }
  };

  // Handle district change
  const handleDistrictChange = (districtName: string) => {
    const provinceName = form.getValues().province;
    if (!provinceName) return;

    const wardsData = getWardsForDistrict(provinceName, districtName);
    setWards(wardsData);

    // Only reset ward if not during initial loading
    if (initialAddressLoaded) {
      form.setValue("ward", "");
    }
  };

  const statusOptions = [
    { value: "đang chờ", label: "Đang chờ" },
    { value: "đang giao", label: "Đang giao" },
    { value: "đã giao", label: "Đã giao" },
    { value: "đã hủy", label: "Đã hủy" },
  ];

  const defaultValues: OrderInputType = {
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    status: "đang chờ",
  };

  // Form initialization
  const form = useForm<OrderInputType>({
    resolver: zodResolver(orderInputSchema),
    defaultValues,
  });

  // Load address data when editing an order
  useEffect(() => {
    // Mark that we haven't loaded address data yet
    setInitialAddressLoaded(false);

    if (editMode && order && provinces.length > 0) {
      // Ensure status is one of the allowed values
      const status =
        order.status === "đang chờ" ||
        order.status === "đang giao" ||
        order.status === "đã giao" ||
        order.status === "đã hủy"
          ? order.status
          : "đang chờ";

      form.reset({
        customer_name: order.customer_name || "",
        customer_phone: order.customer_phone || "",
        customer_email: order.customer_email || "",
        address: order.address || "",
        province: order.province || "",
        district: order.district || "",
        ward: order.ward || "",
        status: status,
      });

      // If editing and province exists, load districts
      if (order.province) {
        const districtsData = getDistrictsForProvince(order.province);
        setDistricts(districtsData);

        // If district exists, load wards
        if (order.district) {
          const wardsData = getWardsForDistrict(order.province, order.district);
          setWards(wardsData);
        }
      }

      // Now we've loaded the initial address data
      setInitialAddressLoaded(true);
    } else if (!editMode || !order) {
      form.reset(defaultValues);
      setDistricts([]);
      setWards([]);
      setInitialAddressLoaded(true);
    }
  }, [
    editMode,
    order,
    provinces.length,
    form,
    getDistrictsForProvince,
    getWardsForDistrict,
  ]);

  const onSubmit = async (data: OrderInputType) => {
    try {
      setLoading(true);

      if (editMode && order) {
        const response = await orderApi.update(order.id.toString(), data);

        if (response.success) {
          toast.success(response.message || "Cập nhật đơn hàng thành công");
          onSuccess?.();
        } else {
          toast.error(response.message || "Lỗi cập nhật đơn hàng");
        }
      } else {
        const response = await orderApi.create(data);
        if (response.success) {
          toast.success(response.message || "Tạo đơn hàng thành công");
          setOpen?.(false);
          onSuccess?.();
        } else {
          toast.error(response.message || "Lỗi tạo đơn hàng");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi không mong muốn.");
    } finally {
      setLoading(false);
    }
  };

  // Combine loading states
  const isFormDisabled = loading || isAddressLoading || !initialAddressLoaded;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Customer Information Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Thông tin khách hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              control={form.control}
              name="customer_name"
              label="Tên khách hàng"
              placeholder="Nhập tên khách hàng"
              disabled={isFormDisabled}
            />

            <CustomInput
              control={form.control}
              name="customer_phone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              disabled={isFormDisabled}
            />

            <CustomInput
              control={form.control}
              name="customer_email"
              label="Email"
              placeholder="Nhập email"
              disabled={isFormDisabled}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Địa chỉ giao hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectWithSearch
              control={form.control}
              name="province"
              label="Tỉnh/Thành phố"
              options={provinces}
              title="Chọn tỉnh/thành phố"
              placeholder="Chọn tỉnh/thành phố"
              disabled={isFormDisabled}
              onChange={(value) => handleProvinceChange(value)}
            />

            <SelectWithSearch
              control={form.control}
              name="district"
              label="Quận/Huyện"
              options={districts}
              title="Chọn quận/huyện"
              placeholder="Chọn quận/huyện"
              disabled={isFormDisabled || !form.getValues().province}
              onChange={(value) => handleDistrictChange(value)}
            />

            <SelectWithSearch
              control={form.control}
              name="ward"
              label="Phường/Xã"
              options={wards}
              title="Chọn phường/xã"
              placeholder="Chọn phường/xã"
              disabled={isFormDisabled || !form.getValues().district}
            />
          </div>

          <CustomInput
            control={form.control}
            name="address"
            label="Địa chỉ cụ thể"
            placeholder="Nhập địa chỉ cụ thể"
            disabled={isFormDisabled}
          />
        </div>

        {/* Order Status Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Trạng thái đơn hàng</h3>
          <SelectWithSearch
            control={form.control}
            name="status"
            label="Trạng thái"
            options={statusOptions}
            title="Chọn trạng thái đơn hàng"
            placeholder="Chọn trạng thái"
            disabled={isFormDisabled}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-2">
          {!editMode && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen?.(false)}
              disabled={isFormDisabled}
            >
              Đóng
            </Button>
          )}

          <Button type="submit" className="relative">
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
            )}
            <span className={loading ? "opacity-0" : ""}>
              {editMode ? "Cập nhật" : "Tạo đơn hàng"}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerInfo;
