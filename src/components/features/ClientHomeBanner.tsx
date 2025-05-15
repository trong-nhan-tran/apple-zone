"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import ArrowButtons from "./ArrowButtons";

type ClientHomeBannerProps = {
  initialBanners: string[];
};

const ClientHomeBanner = ({ initialBanners }: ClientHomeBannerProps) => {
  const swiperRef = useRef<SwiperType>(null);

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {initialBanners.map((banner) => (
          <SwiperSlide key={banner}>
            <a href="">
              <Image
                src={banner}
                alt={"Banner Image"}
                width={1920}
                height={500}
                className="w-full"
                priority={true} // Thêm priority để cải thiện LCP
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      <ArrowButtons
        leftClassName="top-1/2 left-5 z-10"
        rightClassName="top-1/2 right-5 z-10"
        onPrevClick={() => swiperRef.current?.slidePrev()}
        onNextClick={() => swiperRef.current?.slideNext()}
      />
    </div>
  );
};

export default ClientHomeBanner;
