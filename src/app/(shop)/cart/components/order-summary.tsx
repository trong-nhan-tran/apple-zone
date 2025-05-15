"use client";

import React, { memo } from "react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/libs/utils";

interface OrderSummaryProps {
  discount: number;
}

const OrderSummary = ({ discount }: OrderSummaryProps) => {
  // Get total price from the store
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  return (
    <div className="py-4 border-t border-gray-200">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Tạm tính </span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Giảm giá </span>
        <span>{formatPrice(discount)}</span>
      </div>
      <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200">
        <span>Tổng</span>
        <span className="text-red-500">
          {formatPrice(totalPrice - discount)}
        </span>
      </div>
    </div>
  );
};

export default memo(OrderSummary);
