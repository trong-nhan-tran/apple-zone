import React from "react";
import Link from "next/link";
import { formatPrice } from "@/libs/utils";
import { ProductItemType } from "@/schemas";

type SelectOptionProps = {
  optionName: string | null;
  items: ProductItemType[];
  currentSlug: string;
};

const SelectOption = ({
  optionName,
  items,
  currentSlug,
}: SelectOptionProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <p className="text-lg font-medium mb-3">{optionName}</p>

      <div className="grid grid-cols-1 gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.slug}`}
            title={item.name}
            className={`w-full rounded-2xl p-3 border-2 
            flex justify-between items-center transition-colors
            ${
              item.slug === currentSlug
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <span className="font-bold text-lg">{item.option_value}</span>
            <div className="flex flex-col items-end text-lg">
              <span
                className={
                  item.slug === currentSlug ? "text-blue-600 font-medium" : ""
                }
              >
                {formatPrice(item.price)}
              </span>
              <span className="line-through text-gray-400 text-sm">
                {formatPrice(item.price * 1.1)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SelectOption;
