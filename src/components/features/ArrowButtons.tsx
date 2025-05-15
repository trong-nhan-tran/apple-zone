import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  leftClassName?: string;
  rightClassName?: string;
  wrapperClassName?: string;
  onPrevClick?: () => void;
  onNextClick?: () => void;
};

const ArrowButtons = ({
  leftClassName = "left-10",
  rightClassName = "right-10",
  wrapperClassName = "",
  onPrevClick,
  onNextClick,
}: Props) => {
  return (
    <div className={twMerge("z-10", wrapperClassName)}>
      <button
        className={twMerge(
          "absolute top-1/2 cursor-pointer text-white transform -translate-y-1/2 bg-neutral-400 px-4 py-3 rounded-full opacity-70 hover:bg-neutral-500",
          leftClassName
        )}
        onClick={onPrevClick}
      >
        {/* <i className="bi bi-arrow-left"></i> */}
        <i className="bi bi-chevron-left"></i>
      </button>
      <button
        className={twMerge(
          "absolute top-1/2 text-white cursor-pointer transform -translate-y-1/2 bg-neutral-400 px-4 py-3 rounded-full opacity-70 hover:bg-neutral-500",
          rightClassName
        )}
        onClick={onNextClick}
      >
        {/* <i className="bi bi-arrow-right"></i> */}
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};

export default ArrowButtons;
