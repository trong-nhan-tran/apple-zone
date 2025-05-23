"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-shadcn/form";
import { Button } from "@/components/ui-shadcn/button";
import { Input } from "@/components/ui-shadcn/input";
import { Trash2, UploadCloud } from "lucide-react";
import React, { useState, useRef } from "react";
import { Label } from "../ui-shadcn/label";
import { cn } from "@/libs/utils";

type Props = {
  name: string;
  label: string;
  control: any;
  className?: string;
  folder?: string;
  onFileChange?: (file: File | null) => void;
  accept?: string;
  size?: string;
};

const InputImage = (props: Props) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const deletedImageRef = useRef<string | null>(null);
  const containerSize = props.size || "w-[300px] h-[300px]";

  const handleImageSelect = (file: File, field: any) => {
    setImageFile(file);

    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    field.onChange(previewUrl);

    // Notify parent component if needed
    if (props.onFileChange) {
      props.onFileChange(file);
    }
  };

  const handleRemoveImage = (field: any) => {
    if (field.value) {
      deletedImageRef.current = field.value;
    }
    setImageFile(null);
    field.onChange("");

    // Notify parent component if needed
    if (props.onFileChange) {
      props.onFileChange(null);
    }
  };

  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={cn("gap-0", props.className)}>
          <FormLabel className="mb-1 bord">{props.label}</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-3 items-center mt-1">
              {field.value ? (
                <div
                  className={`relative ${containerSize} overflow-hidden group shadow-sm transition-all duration-200 hover:shadow-md`}
                >
                  <img
                    src={field.value}
                    alt="Image preview"
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveImage(field)}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Label
                  htmlFor={`image-upload-${props.name}`}
                  className={`flex flex-col items-center justify-center ${containerSize} cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200`}
                >
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <UploadCloud className="h-10 w-10 mb-3 text-gray-400 transition-transform duration-200 group-hover:scale-110" />
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Chọn ảnh
                    </p>
                    <p className="text-xs text-gray-400">
                      Kéo và thả hoặc nhấp để tải lên PNG, JPG, WEBP
                    </p>
                  </div>
                  <Input
                    id={`image-upload-${props.name}`}
                    type="file"
                    accept={props.accept || "image/*"}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file, field);
                    }}
                  />
                </Label>
              )}
            </div>
          </FormControl>
          <div className="min-h-[16px] transition-all text-sm text-destructive">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default InputImage;
