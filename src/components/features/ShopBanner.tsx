"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ArrowButtons from "@/components/features/ArrowButtons";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useParams } from "next/navigation";
import { useCategoryStore } from "@/store/category-store";
import { bannerService } from "@/services/banner";

type Props = {
  visibleLogo?: boolean;
};

const ShopBanner = ({ visibleLogo = true }: Props) => {
  const { categorySlug } = useParams();
  const [name, setName] = useState("");
  const [banners, setBanners] = useState<string[]>([]);
  const swiperRef = useRef<SwiperType>(null);
  const fetchBanners = async (categorySlug: string) => {
    try {
      const response = await bannerService.getAll(String(categorySlug));
      if (response.err===false && response.data) {
        setBanners(response.data.map((banner: any) => banner.url));
        setName(response.data[0]?.categories?.name || "");
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners(String(categorySlug));
  }, [categorySlug]);
  // Reference to Swiper instance

  return (
    <div className="relative mt-10">
      <div>
        <h2 className="text-3xl text-center mb-10">
          {visibleLogo && <i className="mr-2 bi bi-apple" />}
          {name}
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
            loop={true}
            className="w-full"
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner}>
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

          {swiperRef.current && (
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
