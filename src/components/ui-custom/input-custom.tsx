"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-shadcn/form";

import React from "react";
import { Input } from "../ui-shadcn/input";
import { cn } from "@/libs/utils";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  control: any;
  className?: string;
  disabled?: boolean;
  isRequired?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput = (props: Props) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="w-full gap-0">
          <FormLabel>
            {props.label}{" "}
            {props.isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={props.type || "text"}
              placeholder={props.placeholder}
              className={`input input-bordered w-full mt-1${props.className} ${
                props.disabled ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={props.disabled}
              {...field}
              value={field.value === null ? undefined : field.value}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
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

export default CustomInput;
