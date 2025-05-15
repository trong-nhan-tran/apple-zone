"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ArrowButtons from "@/components/features/ArrowButtons";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

type Props = {
  visibleLogo?: boolean;
  categoryName: string;
  banners: string[];
};

const ShopBanner = ({
  visibleLogo = true,
  categoryName,
  banners = [],
}: Props) => {
  const swiperRef = useRef<SwiperType>(null);

  if (!banners.length) {
    return null;
  }

  return (
    <div className="relative mt-10">
      <div>
        <h2 className="text-3xl text-center mb-10">
          {visibleLogo && <i className="mr-2 bi bi-apple" />}
          {categoryName}
        </h2>

        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={banners.length > 1}
            className="w-full"
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={`${banner}-${index}`}>
                <div className="w-full">
                  <Image
                    src={banner}
                    alt={"Ảnh banner"}
                    width={1920}
                    height={500}
                    className="rounded-2xl"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {banners.length > 1 && swiperRef.current && (
            <ArrowButtons
              leftClassName="top-1/2 left-5 z-10 absolute"
              rightClassName="top-1/2 right-5 z-10 absolute"
              onPrevClick={() => swiperRef.current?.slidePrev()}
              onNextClick={() => swiperRef.current?.slideNext()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopBanner;
