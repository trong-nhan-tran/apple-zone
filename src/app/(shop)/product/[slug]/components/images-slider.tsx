"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ArrowButtons from "@/components/features/ArrowButtons";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";

type Props = {
  images?: {
    id: number;
    src: string;
    alt: string;
  }[];
};

const ImageSlider = ({ images = [] }: Props) => {
  // Reference to Swiper instance
  const swiperRef = useRef<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <div className="relative">
        <Swiper
          modules={[Pagination, Thumbs]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          className="w-full mb-3"
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {images.map((item) => (
            <SwiperSlide key={item.id}>
              <img
                src={item.src}
                alt={item.alt}
                width={1920}
                height={500}
                className="rounded-2xl w-full"
              />
            </SwiperSlide>
          ))}
          <ArrowButtons
            leftClassName="top-1/2 left-5 z-10"
            rightClassName="top-1/2 right-5 z-10"
            onPrevClick={() => swiperRef.current?.slidePrev()}
            onNextClick={() => swiperRef.current?.slideNext()}
          />
        </Swiper>

        {/* Thumbnails */}
        <div className="mt-4">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Navigation, Thumbs]}
            spaceBetween={10}
            slidesPerView={6}
            navigation
            watchSlidesProgress={true}
            className="thumbs-swiper"
          >
            {images.map((banner) => (
              <SwiperSlide key={banner.id} className="cursor-pointer">
                <div className="p-1 transition-all duration-300 h-full">
                  <Image
                    src={banner.src}
                    alt={`Thumbnail ${banner.alt}`}
                    width={80}
                    height={80}
                    className="rounded-lg w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
