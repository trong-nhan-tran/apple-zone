import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/schemas/cart-item-schema";
import { ProductItemType } from "@/schemas";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.product_item_id === item.product_item_id &&
              i.color_name === item.color_name
          );

          if (existingItemIndex !== -1) {
            // Item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity:
                updatedItems[existingItemIndex].quantity + item.quantity,
            };
            return { items: updatedItems };
          } else {
            // New item, add to cart
            return { items: [...state.items, { ...item }] };
          }
        }),

      // Remove an item from cart
      removeItem: (item) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              i.product_item_id !== item.product_item_id ||
              i.color_name !== item.color_name
          ),
        })),

      // Update quantity of an item
      updateQuantity: (item, quantity) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.product_item_id === item.product_item_id &&
              i.color_name === item.color_name
          );
          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: quantity,
            };
            return { items: updatedItems };
          }
          return state;
        }),

      clearCart: () => set({ items: [] }),

      // Get total quantity of all items
      getTotalQuantity: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price of all items
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );
      },
    }),
    {
      name: "apple-zone-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
