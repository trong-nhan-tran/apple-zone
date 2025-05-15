"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ProductItemCard from "./ProductItemCard";
import ArrowButtons from "./ArrowButtons";
import { ProductItemType } from "@/schemas";

// Import Swiper styles
import "swiper/css";

type Props = {
  name?: string;
  products?: ProductItemType[];
  visibleLogo?: boolean;
};

const ProductSlider = ({
  name = "iPhone",
  products = [],
  visibleLogo = true,
}: Props) => {
  // Reference to Swiper instance
  const swiperRef = useRef<SwiperType | null>(null);

  // Dummy products array if none provided
  const displayProducts = products.length ? products : Array(8).fill(null);

  return (
    <div className="max-w-3/4 m-auto mt-16 relative">
      <h1 className="text-4xl text-center">
        {visibleLogo && <i className="mr-2 bi bi-apple" />}
        {name}
      </h1>

      <div className="mt-16 relative">
        <Swiper
          className="w-full"
          spaceBetween={16} // gap-4 trong Tailwind
          slidesPerView={4} // Hiển thị 4 sản phẩm mặc định
          slidesPerGroup={4}
          loop={true}
          speed={500}
          preventInteractionOnTransition={false}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          // Responsive breakpoints
          breakpoints={{
            320: { slidesPerView: 1, slidesPerGroup: 1 },
            640: { slidesPerView: 2, slidesPerGroup: 2 },
            1024: { slidesPerView: 3, slidesPerGroup: 3 },
            1280: { slidesPerView: 4, slidesPerGroup: 4 },
          }}
        >
          {displayProducts.map((product, index) => (
            <SwiperSlide className="p-2" key={product?._id || index}>
              {product ? (
                <ProductItemCard productItem={product} />
              ) : (
                <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg"></div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <ArrowButtons
          leftClassName="top-1/2 -left-16 z-10"
          rightClassName="top-1/2 -right-16 z-10"
          onPrevClick={() => swiperRef.current?.slidePrev()}
          onNextClick={() => swiperRef.current?.slideNext()}
        />
      </div>
    </div>
  );
};

export default ProductSlider;
