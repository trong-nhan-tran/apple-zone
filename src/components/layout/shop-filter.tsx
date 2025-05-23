"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-shadcn/select";

type Props = {};

const Filter = (props: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = ["Mới ra mắt", "Giá thấp đến cao", "Giá cao đến thấp"];

  return (
    <div className="mx-4 sm:mx-0 flex items-center justify-end pb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sắp xếp theo:</span>
        <Select>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Mặc định" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filter;
