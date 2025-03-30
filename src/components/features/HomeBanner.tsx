"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useEffect, useState } from "react";
import { bannerService } from "@/services/banner";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import ArrowButtons from "./ArrowButtons";

type Props = {};

const HomeBanner = ({}: Props) => {
    const [banners, setBanners] = useState<string[]>([]);
    const swiperRef = useRef<SwiperType>(null);
    const fetchBanners = async (categorySlug: string) => {
      try {
        const response = await bannerService.getAll(categorySlug);
        if (response.err ===false && response.data) {
          setBanners(response.data.map((banner: any) => banner.url));
        } else {
          setBanners([]);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
      }
    };
  
    useEffect(() => {
      fetchBanners("home");
    }, []);
  // Reference to Swiper instance




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
        {banners.map((banner) => (
          <SwiperSlide key={banner}>
            <a href="">
              <Image
                src={banner}
                alt={"Banner Image"}
                width={1920}
                height={500}
                className="w-full"
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

export default HomeBanner;
