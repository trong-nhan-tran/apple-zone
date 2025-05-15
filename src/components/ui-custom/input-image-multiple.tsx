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
import { Trash2, Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { Label } from "../ui-shadcn/label";
import { cn } from "@/libs/utils";
import { useFieldArray, Control } from "react-hook-form";

type ImageFieldValue = {
  url: string;
  file?: File;
  isNew?: boolean;
};

type Props = {
  name: string;
  label: string;
  control: Control<any>;
  className?: string;
  folder?: string;
  onFilesChange?: (files: File[]) => void;
  onRemovedUrls?: (urls: string[]) => void;
  accept?: string;
  previewHeight?: string;
  previewWidth?: string;
};

const InputImageMultiple = (props: Props) => {
  // Sử dụng useFieldArray để quản lý mảng ảnh
  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: props.name,
  });

  // Xử lý khi chọn ảnh mới
  const handleImagesSelect = (files: FileList) => {
    const fileArray = Array.from(files);

    // Thêm các file mới vào field array
    fileArray.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      append({
        url: previewUrl,
        file: file,
        isNew: true,
      });
    });

    // Thông báo cho component cha về các file đã thêm
    if (props.onFilesChange) {
      const allFiles = fields
        .filter((field: any) => field.file)
        .map((field: any) => field.file)
        .concat(fileArray);
      props.onFilesChange(allFiles);
    }
  };

  // Xử lý khi xoá ảnh
  const handleRemoveImage = (index: number) => {
    const removedField = fields[index] as unknown as ImageFieldValue;

    // Nếu là ảnh có sẵn từ database (không phải ảnh mới upload)
    if (
      !removedField.isNew &&
      removedField.url &&
      !removedField.url.startsWith("blob:")
    ) {
      if (props.onRemovedUrls) {
        props.onRemovedUrls([removedField.url]);
      }
    }

    // Xoá khỏi field array
    remove(index);

    // Cập nhật lại danh sách file cho component cha
    if (props.onFilesChange) {
      const remainingFiles = fields
        .filter((_, i) => i !== index)
        .filter((field: any) => field.file)
        .map((field: any) => field.file);
      props.onFilesChange(remainingFiles);
    }
  };

  // Dọn dẹp blob URL khi component unmount
  useEffect(() => {
    return () => {
      fields.forEach((field: any) => {
        if (field.url && field.url.startsWith("blob:")) {
          URL.revokeObjectURL(field.url);
        }
      });
    };
  }, [fields]);

  return (
    <FormItem className={cn("gap-0", props.className)}>
      <FormLabel>{props.label}</FormLabel>
      <FormControl>
        <div className="flex flex-col gap-3 mt-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Image previews */}
            {fields.map((field, index) => {
              const imageField = field as unknown as ImageFieldValue;
              return (
                <div
                  key={field.id}
                  className={`relative ${props.previewWidth || "w-full"} ${
                    props.previewHeight || "h-[150px]"
                  } border rounded-md overflow-hidden group`}
                >
                  <Image
                    src={imageField.url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Upload button */}
            <Label
              htmlFor={`image-upload-multiple-${props.name}`}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                props.previewHeight || "h-[150px]"
              }`}
            >
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <Plus className="h-6 w-6 mb-1 text-gray-500" />
                <p className="text-xs text-gray-500">Thêm ảnh</p>
              </div>
              <Input
                id={`image-upload-multiple-${props.name}`}
                type="file"
                accept={props.accept || "image/*"}
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleImagesSelect(e.target.files);
                  }
                }}
              />
            </Label>
          </div>
        </div>
      </FormControl>
      <div className="min-h-[16px] transition-all text-sm text-destructive">
        <FormMessage />
      </div>
    </FormItem>
  );
};

export default InputImageMultiple;
