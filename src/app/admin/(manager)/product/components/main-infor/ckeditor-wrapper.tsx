"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { storageService } from "@/services/storage-service";
import { toast } from "react-hot-toast";

interface CKEditorWrapperProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Custom upload adapter
class SupabaseUploadAdapter {
  private loader;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;

      // Upload to Supabase storage
      const response = await storageService.upload(file, "editor-images");

      if (!response.success) {
        throw new Error(response.message);
      }

      // Extract the URL from the response data
      const imageUrl = response.data;

      // Show success toast
      toast.success("Tải ảnh lên thành công!");

      // Return the URL for CKEditor
      return {
        default: Array.isArray(imageUrl) ? imageUrl[0] : imageUrl,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
      throw error;
    }
  }

  abort() {
    // Implement abort if needed
  }
}

// Plugin function to integrate the adapter
function SupabaseUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new SupabaseUploadAdapter(loader);
  };
}

export default function CKEditorWrapper({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
}: CKEditorWrapperProps) {
  return (
    <div className="rich-text-editor pointer-event:auto">
      <CKEditor
        editor={ClassicEditor as any}
        data={value}
        config={{
          licenseKey: "GPL",
          placeholder,
          extraPlugins: [SupabaseUploadAdapterPlugin],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "insertTable",
            "undo",
            "redo",
            "imageUpload",
          ],
          image: {
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}
