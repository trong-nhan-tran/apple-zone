"use client";

import React, { memo } from "react";
import { useCartStore } from "@/stores/cart-store";
import CartItem from "./cart-item";

const CartList = () => {
  // Access cart items directly from the store
  const { items, getTotalQuantity } = useCartStore();

  return (
    <div className="space-y-4 mb-6">
      <div className="mb-2">{getTotalQuantity()} sản phẩm trong giỏ hàng</div>

      {/* Map through items and render CartItem components */}
      {items.map((item) => (
        <CartItem
          key={`${item.product_item_id}-${item.color_name}`}
          item={item}
        />
      ))}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(CartList);
