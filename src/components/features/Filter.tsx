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

  const options = [
    "Nổi bật",
    "Mới ra mắt",
    "Giá thấp đến cao",
    "Giá cao đến thấp",
  ];

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="flex justify-end">
      <Select>
        <SelectTrigger className="bg-white">
          <SelectValue className="" placeholder="Xếp theo" />
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
  );
};

export default Filter;
