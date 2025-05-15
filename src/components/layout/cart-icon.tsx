"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";

const CartIcon = () => {
  const { getTotalQuantity, items } = useCartStore();
  const [itemCount, setItemCount] = useState(0);

  // Update item count when cart changes
  useEffect(() => {
    setItemCount(getTotalQuantity());
  }, [getTotalQuantity, items]);

  return (
    <Link href="/cart" className="relative">
      <i className="bi bi-bag text-xl"></i>
      {itemCount > 0 && (
        <span className="absolute top-3 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
