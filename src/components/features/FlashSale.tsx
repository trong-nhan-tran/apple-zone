"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ProductCardSale from "./ProductCardSale";
import ArrowButtons from "./ArrowButtons";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

type Props = {};

const FlashSale = (props: Props) => {
  // Reference to Swiper instance
  const swiperRef = useRef<SwiperType | null>(null);

  // Generate an array of product cards for demo
  const productCards = Array(24).fill(null);

  return (
    <div className="container mx-auto max-w-3/4 bg-amber-100 my-4 relative rounded-2xl pb-4">
      <div className="flex justify-between items-center">
        <div>
          <Image
            src="/images/flash_sale/flash_sale.png"
            alt="flash_sale"
            width={480}
            height={500}
          ></Image>
        </div>
        <div className="font-bold text-xl text-center">
          <h1 className="mb-2">KẾT THÚC TRONG</h1>
          <span className="">
            <label className="bg-neutral-300 p-2 rounded-xl" htmlFor="">
              01
            </label>
            :
            <label className="bg-neutral-300 p-2 rounded-xl" htmlFor="">
              02
            </label>
            :
            <label className="bg-neutral-300 p-2 rounded-xl" htmlFor="">
              01
            </label>
          </span>
        </div>
        <div className="pr-14 font-bold text-xl text-center">
          <h1 className="font-bold mb-2">THỜI GIAN DIỄN RA</h1>
          <span>8:00 - 23:59</span>
        </div>
      </div>

      <div className="relative mx-4">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={8} // Tương đương với gap-2
          slidesPerView={6} // Hiển thị 6 sản phẩm
          slidesPerGroup={6}
          loop={true}
          speed={2000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="w-full"
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          // Responsive breakpoints
          breakpoints={{
            320: { slidesPerView: 1, slidesPerGroup: 1 },
            640: { slidesPerView: 2, slidesPerGroup: 2 },
            768: { slidesPerView: 3, slidesPerGroup: 3 },
            1024: { slidesPerView: 4, slidesPerGroup: 4 },
            1280: { slidesPerView: 6, slidesPerGroup: 6 },
          }}
        >
          {productCards.map((_, index) => (
            <SwiperSlide key={index}>
              <ProductCardSale />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ArrowButtons
        leftClassName="top-1/2 -left-16 z-10"
        rightClassName="top-1/2 -right-16 z-10"
        onPrevClick={() => swiperRef.current?.slidePrev()}
        onNextClick={() => swiperRef.current?.slideNext()}
      />
    </div>
  );
};

export default FlashSale;
