import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui-shadcn/tabs";
import { Button } from "@/components/ui-shadcn/button";
import { formatPrice } from "@/libs/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomerStore, CustomerAddress } from "@/stores/customer-store";
import { useAddressStore } from "@/stores/tree-address-store";
import CustomInput from "@/components/ui-custom/input-custom";
import SelectWithSearch from "@/components/ui-custom/select-with-search";
import { Form } from "@/components/ui-shadcn/form";
import { orderInputSchema, OrderInputType } from "@/schemas/order-schema";
import { useEffect } from "react";

interface CustomerInformationProps {
  onCheckout: (addressData: CustomerAddress) => void;
  totalPrice: number;
  discount: number;
  loading?: boolean;
}

const CustomerInformation = ({
  onCheckout,
  totalPrice,
  discount,
  loading = false,
}: CustomerInformationProps) => {
  // Get customer data from store - updated property names
  const {
    customerName,
    phoneNumber,
    customerEmail,
    address,
    setCustomerName,
    setPhoneNumber,
    setCustomerEmail,
    setAddress,
    saveAddressData,
  } = useCustomerStore();

  // Get address data from store
  const {
    fetchAddressData,
    provinces,
    getDistrictsForProvince,
    getWardsForDistrict,
    isLoading,
  } = useAddressStore();

  // Form setup with order schema
  const form = useForm<OrderInputType>({
    resolver: zodResolver(orderInputSchema),
    defaultValues: {
      customer_name: customerName,
      customer_phone: phoneNumber,
      customer_email: customerEmail, // Now using customerEmail from store
      address: address, // Updated from streetAddress to address
      province: "",
      district: "",
      ward: "",
      status: "đang chờ", // Default status for new orders
    },
  });

  const { watch, setValue } = form;
  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  // Load address data on component mount
  useEffect(() => {
    fetchAddressData();
  }, [fetchAddressData]);

  // Update form values when customer data changes
  useEffect(() => {
    setValue("customer_name", customerName);
    setValue("customer_phone", phoneNumber);
    setValue("customer_email", customerEmail); // Updated
    setValue("address", address); // Updated
  }, [customerName, phoneNumber, customerEmail, address, setValue]);

  // Sync form values with customer store
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerEmail(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  // Get districts for selected province
  const districtOptions = selectedProvince
    ? getDistrictsForProvince(selectedProvince)
    : [];

  // Get wards for selected district
  const wardOptions =
    selectedProvince && selectedDistrict
      ? getWardsForDistrict(selectedProvince, selectedDistrict)
      : [];

  // Handle form submission
  const onSubmit = (data: OrderInputType) => {
    // Get full address details
    const provinceLabel =
      provinces.find((p) => p.value === data.province)?.label || "";
    const districtLabel =
      districtOptions.find((d) => d.value === data.district)?.label || "";
    const wardLabel =
      wardOptions.find((w) => w.value === data.ward)?.label || "";

    // Create address data object with updated structure
    const addressData: CustomerAddress = {
      province: provinceLabel,
      district: districtLabel,
      ward: wardLabel,
      address: data.address,
    };

    // Save to store and checkout
    saveAddressData(addressData);
    onCheckout(addressData);
  };

  return (
    <div className="p-6 w-full border-t border-gray-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="font-bold mb-4 text-lg">Thông tin khách hàng</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <CustomInput
                name="customer_name"
                label="Họ và Tên"
                placeholder="Họ và Tên"
                control={form.control}
                className="w-full h-[40px]"
                isRequired
                onChange={handleNameChange}
              />

              <CustomInput
                name="customer_phone"
                label="Số điện thoại"
                placeholder="Số điện thoại"
                control={form.control}
                className="w-full h-[40px]"
                isRequired
                onChange={handlePhoneChange}
              />
            </div>

            <div className="mt-4">
              <CustomInput
                name="customer_email"
                label="Email"
                placeholder="Địa chỉ email"
                type="email"
                control={form.control}
                className="w-full h-[40px]"
                isRequired
                onChange={handleEmailChange}
              />
            </div>
          </div>

          {/* Delivery Options */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-bold mb-4 text-lg">Chọn hình thức nhận hàng</h3>
            <Tabs defaultValue="1" className="bg-zinc-50 rounded-2xl p-2">
              <TabsList className="grid w-full grid-cols-2 h-12 bg-white mb-4">
                <TabsTrigger value="1">Giao tận nơi</TabsTrigger>
                <TabsTrigger value="2">Nhận tại cửa hàng</TabsTrigger>
              </TabsList>

              {/* Home Delivery Tab */}
              <TabsContent value="1">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectWithSearch
                      name="province"
                      label="Tỉnh/Thành"
                      control={form.control}
                      options={provinces}
                      isRequired
                      disabled={isLoading}
                      className="h-[40px]"
                    />

                    <SelectWithSearch
                      name="district"
                      label="Quận/Huyện"
                      control={form.control}
                      options={districtOptions}
                      isRequired
                      disabled={!selectedProvince || isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectWithSearch
                      name="ward"
                      label="Phường/Xã"
                      control={form.control}
                      options={wardOptions}
                      isRequired
                      disabled={!selectedDistrict || isLoading}
                    />

                    <CustomInput
                      name="address"
                      label="Địa chỉ"
                      placeholder="Số nhà, tên đường"
                      control={form.control}
                      isRequired
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Store Pickup Tab */}
              <TabsContent value="2">
                <div className="p-4 text-center text-gray-500">
                  Tính năng này đang được phát triển. Vui lòng chọn giao tận
                  nơi.
                </div>
              </TabsContent>
            </Tabs>

            {/* Checkout Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 bg-blue-500 cursor-pointer hover:bg-blue-400 transition-all text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                `Đặt hàng (${formatPrice(totalPrice - discount)})`
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CustomerInformation;
