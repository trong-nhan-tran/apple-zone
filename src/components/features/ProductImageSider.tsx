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
  name?: string;
  visibleLogo?: boolean;
  banners?: {
    id: number;
    src: string;
    alt: string;
  }[];
};

const ProductImageSlider = ({
  name = "iPhone",
  visibleLogo = true,
  banners = [
    {
      id: 1,
      src: "/images/product/ip.png",
      alt: "iPhone banner",
    },
    {
      id: 2,
      src: "/images/product/ip2.jpg",
      alt: "iPhone banner 2",
    },
    {
      id: 3,
      src: "/images/product/ip2.jpg",
      alt: "iPhone banner 2",
    },
    {
      id: 4,
      src: "/images/product/ip2.jpg",
      alt: "iPhone banner 2",
    },
    {
      id: 5,
      src: "/images/product/ip2.jpg",
      alt: "iPhone banner 2",
    },
    {
      id: 6,
      src: "/images/product/ip2.jpg",
      alt: "iPhone banner 2",
    },
    {
      id: 7,
      src: "/images/product/ip2.jpg",
      alt: "iPhone banner 2",
    },
  ],
}: Props) => {
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
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <img
                src={banner.src}
                alt={banner.alt}
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
            {banners.map((banner) => (
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

export default ProductImageSlider;
