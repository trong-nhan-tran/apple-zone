import React from "react";
import Image from "next/image";
import { Label } from "@/components/ui-shadcn/label";
import { ProductColorType } from "@/schemas";

type SelectColorProps = {
  colors: ProductColorType[] | [];
  selectedColorId: number | null;
  onSelectColor: (colorId: number) => void;
};

const SelectColor = ({
  colors = [],
  selectedColorId,
  onSelectColor,
}: SelectColorProps) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <p className="text-lg font-medium mb-3">Màu sắc</p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <div key={color.id}>
            <input
              type="radio"
              id={`color-${color.id}`}
              name="color"
              value={color.id}
              className="peer hidden"
              checked={selectedColorId === color.id}
              onChange={() => onSelectColor(color.id)}
            />
            <Label
              htmlFor={`color-${color.id}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer
              border-2 transition-all
              ${
                selectedColorId === color.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              title={color.color_name}
            >
              <div className="w-[40px] h-[40px] overflow-hidden flex-shrink-0 relative">
                {color.thumbnail && (
                  <Image
                    src={color.thumbnail}
                    alt={color.color_name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  selectedColorId === color.id
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {color.color_name}
              </span>
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectColor;
