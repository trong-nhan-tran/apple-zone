import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductItemType } from "@/types/schema";

export interface CartItem {
  id: number; // product_item_id
  productItem: ProductItemType;
  quantity: number;
  color: {
    id: number;
    name: string;
    code?: string | null;
  };
  selected: boolean;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number, colorId: number) => void;
  updateQuantity: (itemId: number, colorId: number, quantity: number) => void;
  toggleSelectItem: (itemId: number, colorId: number) => void;
  selectAllItems: (selected: boolean) => void;
  clearCart: () => void;
  getSelectedItems: () => CartItem[];
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  getSelectedTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add a product to cart, increase quantity if already exists with the same color
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.color.id === item.color.id
          );

          if (existingItemIndex !== -1) {
            // Item with the same color exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity:
                updatedItems[existingItemIndex].quantity + item.quantity,
            };
            return { items: updatedItems };
          } else {
            // New item, add to cart
            return { items: [...state.items, { ...item, selected: true }] };
          }
        }),

      // Remove an item from cart
      removeItem: (itemId, colorId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === itemId && item.color.id === colorId)
          ),
        })),

      // Update quantity of an item
      updateQuantity: (itemId, colorId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId && item.color.id === colorId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      // Toggle selection of an item
      toggleSelectItem: (itemId, colorId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId && item.color.id === colorId
              ? { ...item, selected: !item.selected }
              : item
          ),
        })),

      // Select all items or deselect all
      selectAllItems: (selected) =>
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected })),
        })),

      // Clear the cart
      clearCart: () => set({ items: [] }),

      // Get only selected items
      getSelectedItems: () => {
        return get().items.filter((item) => item.selected);
      },

      // Get total quantity of all items
      getTotalQuantity: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price of all items
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity * item.productItem.price,
          0
        );
      },

      // Get total price of selected items
      getSelectedTotalPrice: () => {
        return get()
          .items.filter((item) => item.selected)
          .reduce(
            (total, item) => total + item.quantity * item.productItem.price,
            0
          );
      },
    }),
    {
      name: "apple-zone-cart",
      // Optional: customize serialization/deserialization
      partialize: (state) => ({ items: state.items }),
    }
  )
);
