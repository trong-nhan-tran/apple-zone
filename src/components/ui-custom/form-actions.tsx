"use client";

import { Button } from "@/components/ui-shadcn/button";
import { cn } from "@/libs/utils";

type FormActionsProps = {
  loading?: boolean;
  onCancel?: () => void;
  showCancel?: boolean;
  cancelText?: string;
  submitText?: string;
  className?: string;
};

const FormActions = ({
  loading = false,
  onCancel,
  showCancel = true,
  cancelText = "Hủy",
  submitText = "Lưu",
  className,
}: FormActionsProps) => {
  return (
    <div className={cn("flex justify-end gap-2", className)}>
      {showCancel && onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      <Button type="submit" disabled={loading} className="relative">
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-arrow-repeat animate-spin text-white"></i>
          </span>
        )}
        <span className={loading ? "opacity-0" : ""}>{submitText}</span>
      </Button>
    </div>
  );
};

export default FormActions;
