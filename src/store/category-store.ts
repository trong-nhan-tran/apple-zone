import { create } from "zustand";
import { CategoryType } from "@/types/schema";
import { categoryService } from "@/services/category";

interface CategoryState {
  // State
  categories: CategoryType[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (
    category: Omit<CategoryType, "id">
  ) => Promise<CategoryType | null>;
  updateCategory: (
    id: string,
    categoryData: Partial<CategoryType>
  ) => Promise<CategoryType | null>;
  deleteCategory: (id: string) => Promise<boolean>;
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
      const response = await categoryService.getAll();

      if (response.err) {
        throw new Error(
          response.mess || "Failed to fetch categories"
        );
      }

      // Direct access to response.data from service
      set({ categories: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
        isLoading: false,
      });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.create(category as CategoryType);

      if (response.err) {
        throw new Error(response.mess || "Failed to add category");
      }

      // Direct access to response.data from service
      if (response.data) {
        if (response.data) {
          set((state) => ({
            categories: [...state.categories, ...(response.data ? [response.data] : [])],
            isLoading: false,
          }));
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }

      return response.data || null;
    } catch (error) {
      console.error("Error adding category:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to add category",
        isLoading: false,
      });
      return null; // Explicitly return null to avoid undefined
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.update(
        id,
        categoryData as CategoryType
      );

      if (response.err) {
        throw new Error(response.mess || "Failed to update category");
      }

      // Direct access to response.data from service
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === Number(id) ? { ...cat, ...response.data } : cat
        ),
        isLoading: false,
      }));

      return response.data || null; // Ensure undefined is replaced with null
    } catch (error) {
      console.error("Error updating category:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to update category",
        isLoading: false,
      });
      return null;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.delete(id);

      if (response.err) {
        throw new Error(response.mess|| "Failed to delete category");
      }

      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== Number(id)),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete category",
        isLoading: false,
      });
      return false;
    }
  },

  setError: (error) => set({ error }),

  resetState: () => set({ categories: [], isLoading: false, error: null }),
}));
