"use client";

import React from "react";
import { useCartStore } from "@/stores/cart-store";
import { useCustomerStore, CustomerAddress } from "@/stores/customer-store";

import CartEmpty from "./components/cart-empty";
import CustomerInformation from "./components/customer-information";
import CartList from "./components/cart-list";
import OrderSummary from "./components/order-summary";
import VoucherInput from "./components/voucher-input";
import { orderApi, orderItemApi } from "@/apis";
import toast from "react-hot-toast";

const CartPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { customerName, phoneNumber, customerEmail, resetCustomerData } =
    useCustomerStore();
  const [loading, setLoading] = React.useState(false);
  // Initialize discount to 0
  const discount = 0;

  // Handle voucher application
  const handleApplyVoucher = (code: string) => {
    console.log("Applying voucher:", code);
  };

  // Handle checkout
  const handleCheckout = async (addressData: CustomerAddress) => {
    setLoading(true);
    if (items.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    const orderData = {
      customer_name: customerName,
      customer_phone: phoneNumber,
      customer_email: customerEmail,
      address: addressData.address,
      province: addressData.province,
      district: addressData.district,
      ward: addressData.ward,
      status: "đang chờ" as "đang chờ" | "đang giao" | "đã giao" | "đã hủy",
    };

    const orderItems = items.map((item) => ({
      product_item_id: item.product_item_id,
      quantity: item.quantity,
      color_name: item.color_name,
      price: item.price,
      option_name: item.option_name,
      option_value: item.option_value,
      product_name: item.product_name,
    }));
    console.log("Order data:", orderData);
    console.log("Order items:", orderItems);

    try {
      const orderResponse = await orderApi.create(orderData);
      if (orderResponse.success) {
        const orderId = orderResponse.data.id;
        console.log("Order created successfully:", orderId);

        // Create order items
        const orderItemPromises = orderItems.map((item) =>
          orderItemApi.create({ ...item, order_id: orderId })
        );
        const orderItemResponses = await Promise.all(orderItemPromises);

        // Check if all order items were created successfully
        const allItemsCreated = orderItemResponses.every(
          (response) => response.success
        );

        if (allItemsCreated) {
          toast.success("Đặt hàng thành công");
          clearCart();
        } else {
          toast.error("Đặt hàng thất bại");
          return;
        }
      } else {
        toast.error(orderResponse.message || "Đặt hàng thất bại");
        return;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Đặt hàng thất bại");
      return;
    }
    // resetCustomerData();
  };

  // Check for empty cart
  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="flex flex-col w-full md:max-w-3xl m-auto mt-0 md:mt-5 rounded-2xl bg-white p-4">
      <div className="w-full p-6">
        <h2 className="font-bold mb-4 text-2xl">Giỏ hàng</h2>

        {/* Memoized Cart List Component */}
        <CartList />

        {/* Memoized Voucher Input Component */}
        <VoucherInput onApply={handleApplyVoucher} />

        {/* Memoized Order Summary Component */}
        <OrderSummary discount={discount} />
      </div>

      {/* Customer Information Component */}
      <CustomerInformation
        totalPrice={getTotalPrice()}
        discount={discount}
        onCheckout={handleCheckout}
        loading={loading}
      />
    </div>
  );
};

export default CartPage;
