"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/libs/utils";

interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function SimpleModal({
  open,
  onClose,
  children,
  title,
  className,
}: SimpleModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay/Backdrop - clicking this will close the modal */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div
          className={cn(
            "bg-background rounded-xl shadow-lg w-full max-w-md flex flex-col max-h-[95vh] border relative",
            className
          )}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
        >
          {/* Fixed Header */}
          {title && (
            <div className="flex items-center justify-between p-3 rounded-t-xl border-b sticky top-0 bg-background z-10">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-muted/80"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="p-4 overflow-auto flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
