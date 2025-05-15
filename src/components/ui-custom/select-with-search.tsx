"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-shadcn/form";
import { Combobox } from "@/components/ui-custom/combobox";
import React from "react";

import { cn } from "@/libs/utils";

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  control: any;
  options: SelectOption[];
  title?: string;
  placeholder?: string;
  className?: string;
  isRequired?: boolean;
  isNumeric?: boolean;
  disabled?: boolean;
  defaultValue?: string | number | null;
  onChange?: (value: any) => void;
};

const SelectWithSearch = (props: Props) => {
  const {
    name,
    label,
    control,
    options,
    title = "Chọn",
    placeholder = "Tìm kiếm...",
    className,
    isRequired = false,
    isNumeric = false,
    disabled = false,
    onChange,
  } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("gap-0", className)}>
          <FormLabel>
            {label} {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl className="mt-1">
            <Combobox
              title={title}
              options={options}
              value={field.value ? String(field.value) : undefined}
              onChange={(value) => {
                // Convert to number if needed
                const finalValue = value
                  ? isNumeric
                    ? Number(value)
                    : value
                  : null;

                field.onChange(finalValue);

                // Call custom onChange handler if provided
                if (onChange) {
                  onChange(finalValue);
                }
              }}
              placeholder={placeholder}
              className={disabled ? "opacity-70 cursor-not-allowed" : ""}
              disabled={disabled}
            />
          </FormControl>
          <div className="min-h-[16px] transition-all text-sm text-destructive">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default SelectWithSearch;
