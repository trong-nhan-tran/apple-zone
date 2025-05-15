import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerAddress {
  province: string;
  district: string;
  ward: string;
  address: string;
}

interface CustomerStore {
  // Customer info matching orderInputSchema
  customerName: string;
  phoneNumber: string;
  customerEmail: string;

  // Address info
  address: string;
  province: string;
  district: string;
  ward: string;

  // Actions
  setCustomerName: (name: string) => void;
  setPhoneNumber: (phone: string) => void;
  setCustomerEmail: (email: string) => void;
  setAddress: (address: string) => void;
  setProvince: (province: string) => void;
  setDistrict: (district: string) => void;
  setWard: (ward: string) => void;

  // Full address (for checkout)
  saveAddressData: (data: CustomerAddress) => void;
  getFullAddress: () => CustomerAddress;

  // Reset all data
  resetCustomerData: () => void;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      customerName: "",
      phoneNumber: "",
      customerEmail: "",
      address: "",
      province: "",
      district: "",
      ward: "",

      // Actions
      setCustomerName: (name) => set({ customerName: name }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setCustomerEmail: (email) => set({ customerEmail: email }),
      setAddress: (address) => set({ address: address }),
      setProvince: (province) => set({ province: province }),
      setDistrict: (district) => set({ district: district }),
      setWard: (ward) => set({ ward: ward }),

      saveAddressData: (data) =>
        set({
          province: data.province,
          district: data.district,
          ward: data.ward,
          address: data.address,
        }),

      getFullAddress: () => ({
        province: get().province,
        district: get().district,
        ward: get().ward,
        address: get().address,
      }),

      resetCustomerData: () =>
        set({
          customerName: "",
          phoneNumber: "",
          customerEmail: "",
          address: "",
          province: "",
          district: "",
          ward: "",
        }),
    }),
    {
      name: "apple-zone-customer",
      // Only save to localStorage the customer data that should persist
      partialize: (state) => ({
        customerName: state.customerName,
        phoneNumber: state.phoneNumber,
        customerEmail: state.customerEmail,
        address: state.address,
        province: state.province,
        district: state.district,
        ward: state.ward,
      }),
    }
  )
);
