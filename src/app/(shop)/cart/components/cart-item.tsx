import React, { memo } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/libs/utils";
import { useCartStore } from "@/stores/cart-store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { CartItem as CartItemType } from "@/schemas/cart-item-schema";

// Schema for form validation
const cartItemSchema = z.object({
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

type CartItemFormValues = z.infer<typeof cartItemSchema>;

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeItem, updateQuantity } = useCartStore();

  // Initialize form with current item values
  const { control, setValue } = useForm<CartItemFormValues>({
    resolver: zodResolver(cartItemSchema),
    defaultValues: {
      quantity: item.quantity,
    },
  });

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      // Update form value
      setValue("quantity", newQuantity);

      // Update cart store
      updateQuantity(item, newQuantity);
    }
  };

  // Handle remove item
  const handleRemoveItem = () => {
    removeItem(item);
  };

  return (
    <div className="flex border border-gray-200 rounded-lg p-3 relative">
      {/* Delete button on top right */}
      <button
        onClick={handleRemoveItem}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <X size={16} />
      </button>

      {/* Product image */}
      <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.thumbnail || "/placeholder.png"}
          alt={item.color_name}
          fill
          className="object-cover"
          sizes="90px"
          priority={false}
        />
      </div>

      <div className="flex-1 ml-4">
        {/* Product name and price */}
        <div className="flex items-center justify-between mr-6">
          <Link
            href={`/product/${item.slug}`}
            className="font-medium text-gray-800 hover:text-gray-500 transition-colors"
          >
            {item.product_name}
          </Link>
          <div className="text-red-500 font-medium">
            <span>{formatPrice(item.price)}</span>
          </div>
        </div>

        <div className="text-gray-600 flex justify-between mr-6">
          <span className="text-sm mt-1.5 ">Màu: {item.color_name}</span>
          <span className="line-through">
            {formatPrice((item.price || 0) * 1.1)}
          </span>
        </div>
        {/* Color and quantity controls */}
        <div className="flex justify-end items-center mt-3">
          {/* Quantity controls */}
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <div className="flex items-center border border-gray-300 rounded-full h-6 mr-6">
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleQuantityChange(field.value - 1)}
                  disabled={field.value <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm">{field.value}</span>
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-500"
                  onClick={() => handleQuantityChange(field.value + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CartItem);
