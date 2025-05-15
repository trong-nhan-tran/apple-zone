import { create } from "zustand";
import { CategoryType } from "@/schemas";
import { categoryApi } from "@/apis";

interface CategoryState {
  // State
  categories: CategoryType[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;

  setError: (error: string | null) => void;
  resetState: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  // Initial state
  categories: [],
  isLoading: false,
  error: null,

  // Actions
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryApi.getAllParents();

      if (response.success === false) {
        throw new Error(response.message || "Failed to fetch categories");
      }

      // Direct access to response.data from service
      set({ categories: response.data || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
        isLoading: false,
      });
    }
  },

  setError: (error) => set({ error }),

  resetState: () => set({ categories: [], isLoading: false, error: null }),
}));
