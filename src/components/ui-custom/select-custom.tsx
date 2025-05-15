"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-shadcn/select";
type Props = {
  options: any[];
  defaultValue?: string;
  placeholder?: string;
};

const SelectCustom = ({ options = [], defaultValue, placeholder }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };
  console.log(selectedOption);

  return (
    <Select onValueChange={handleOptionChange} defaultValue={defaultValue}>
      <SelectTrigger className="bg-white">
        <SelectValue className="" placeholder={placeholder} />
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
  );
};

export default SelectCustom;
