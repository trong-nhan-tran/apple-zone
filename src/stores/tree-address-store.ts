import { create } from "zustand";
import { persist } from "zustand/middleware";

type AddressOption = {
  value: string;
  label: string;
};

interface AddressState {
  // Raw address data
  addressData: Record<string, any> | null;

  // Formatted data for UI
  provinces: AddressOption[];
  districts: Record<string, AddressOption[]>;
  wards: Record<string, AddressOption[]>;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAddressData: () => Promise<void>;
  getDistrictsForProvince: (provinceName: string) => AddressOption[];
  getWardsForDistrict: (
    provinceName: string,
    districtName: string
  ) => AddressOption[];
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addressData: null,
      provinces: [],
      districts: {},
      wards: {},
      isLoading: false,
      error: null,

      fetchAddressData: async () => {
        // Skip if already loaded
        if (get().addressData) return;

        try {
          set({ isLoading: true, error: null });
          const response = await fetch("/jsons/tree-address.json");
          const data = await response.json();

          // Format provinces for dropdown
          const provinceOptions = Object.keys(data).map((key) => ({
            value: data[key].name,
            label: data[key].name_with_type,
          }));

          set({
            addressData: data,
            provinces: provinceOptions,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error loading address data:", error);
          set({
            error: "Không thể tải dữ liệu địa chỉ",
            isLoading: false,
          });
        }
      },

      getDistrictsForProvince: (provinceName: string): AddressOption[] => {
        const { addressData, districts } = get();

        // Return from cache if available
        if (districts[provinceName]) {
          return districts[provinceName];
        }

        // Get fresh data if not in cache
        if (!addressData) return [];

        // Find province data
        const provinceEntry = Object.entries(addressData).find(
          ([_, province]: [string, any]) => province.name === provinceName
        );

        if (!provinceEntry) return [];

        const [_, provinceData] = provinceEntry;

        // Format districts for dropdown
        const districtOptions = Object.keys(provinceData["quan-huyen"]).map(
          (key) => ({
            value: provinceData["quan-huyen"][key].name,
            label: provinceData["quan-huyen"][key].name_with_type,
          })
        );

        // Update district cache
        set((state) => ({
          districts: {
            ...state.districts,
            [provinceName]: districtOptions,
          },
        }));

        return districtOptions;
      },

      getWardsForDistrict: (
        provinceName: string,
        districtName: string
      ): AddressOption[] => {
        const { addressData, wards } = get();

        // Create a unique key for the province+district combination
        const cacheKey = `${provinceName}-${districtName}`;

        // Return from cache if available
        if (wards[cacheKey]) {
          return wards[cacheKey];
        }

        // Get fresh data if not in cache
        if (!addressData) return [];

        // Find province data
        const provinceEntry = Object.entries(addressData).find(
          ([_, province]: [string, any]) => province.name === provinceName
        );

        if (!provinceEntry) return [];

        const [_, provinceData] = provinceEntry;

        // Find district data
        const districtEntry = Object.entries(provinceData["quan-huyen"]).find(
          ([_, district]: [string, any]) => district.name === districtName
        );

        if (!districtEntry) return [];

        const [__, districtData]: [string, any] = districtEntry;

        // Format wards for dropdown
        const wardOptions = Object.keys(districtData["xa-phuong"] || {}).map(
          (key) => ({
            value: districtData["xa-phuong"][key]?.name || "",
            label: districtData["xa-phuong"][key]?.name_with_type || "",
          })
        );

        // Update ward cache
        set((state) => ({
          wards: {
            ...state.wards,
            [cacheKey]: wardOptions,
          },
        }));

        return wardOptions;
      },
    }),
    {
      name: "address-storage",
      partialize: (state) => ({
        addressData: state.addressData,
        provinces: state.provinces,
        districts: state.districts,
        wards: state.wards,
      }),
    }
  )
);
