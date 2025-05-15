"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Define the props interface
interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Create a placeholder component to show during loading
function EditorPlaceholder() {
  return (
    <div className="border w-full p-4 bg-gray-50">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamically import the editor component with SSR disabled
const CKEditorWrapper = dynamic(
  () => {
    return import("./ckeditor-wrapper").then((mod) => mod.default);
  },
  {
    ssr: false,
    loading: () => <EditorPlaceholder />,
  }
);

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
}: RichTextEditorProps) {
  // If needed, we could add additional processing or cleanup functions here
  // For example, to handle image URLs in the content when the component unmounts

  return (
    <div className="rich-text-container overflow-hidden">
      <CKEditorWrapper
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
