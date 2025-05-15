"use client";

import React from "react";
import { Button } from "@/components/ui-shadcn/button";
import { cn } from "@/libs/utils";

type ButtonWithTooltipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
  size?: "default" | "sm" | "lg" | "icon";
  tooltipPosition?: "top" | "bottom" | "left" | "right";
};

const ButtonWithTooltip = React.forwardRef<
  HTMLButtonElement,
  ButtonWithTooltipProps
>(
  (
    {
      className,
      children,
      tooltip,
      variant = "default",
      size = "default",
      tooltipPosition = "top",
      ...props
    },
    ref
  ) => {
    // Xác định class theo vị trí tooltip
    const tooltipClass = {
      top: "left-1/2 -translate-x-1/2 bottom-full mb-2",
      bottom: "left-1/2 -translate-x-1/2 top-full mt-2",
      left: "right-full mr-2 top-1/2 -translate-y-1/2",
      right: "left-full ml-2 top-1/2 -translate-y-1/2",
    }[tooltipPosition];

    return (
      <div className="relative group inline-block">
        <Button
          ref={ref}
          variant={variant === "primary" ? "default" : variant}
          size={size}
          className={cn(
            variant === "primary" && "bg-blue-500 hover:bg-blue-600",
            className
          )}
          {...props}
        >
          {children}
        </Button>
        <div
          className={cn(
            "absolute px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50",
            tooltipClass
          )}
        >
          {tooltip}
        </div>
      </div>
    );
  }
);

ButtonWithTooltip.displayName = "ButtonWithTooltip";

export { ButtonWithTooltip };
