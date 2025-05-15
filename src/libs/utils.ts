import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accent marks)
    .toLowerCase()
    .replace(/đ/g, "d") // Replace Vietnamese đ with d
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove whitespace from both ends
}

export const serializeBigInt = (data: any): any => {
  if (data === null || data === undefined) return data;

  if (typeof data === "bigint") {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeBigInt(item));
  }

  if (typeof data === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = serializeBigInt(value);
    }
    return result;
  }

  return data;
};

export const deserializeBigInt = (data: any): any => {
  if (data === null || data === undefined) return data;

  if (typeof data === "string" && /^\d+$/.test(data)) {
    return BigInt(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => deserializeBigInt(item));
  }

  if (typeof data === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Chỉ chuyển đổi các trường có tên kết thúc bằng _id hoặc id
      if (key.endsWith("_id") || key === "id") {
        result[key] = deserializeBigInt(value);
      } else {
        result[key] = deserializeBigInt(value);
      }
    }
    return result;
  }

  return data;
};

/**
 * Formats a number as Vietnamese currency (VND)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
