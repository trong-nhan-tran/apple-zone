import React from "react";
import { bannerService } from "@/services";
import ClientHomeBanner from "./ClientHomeBanner";

export async function HomeBanner() {
  // Fetch banners on server side
  const response = await bannerService.getHomeBanners();
  const banners =
    response.success && response.data
      ? response.data.map((banner: any) => banner.url)
      : [];

  // Pass server data to client component for hydration
  return <ClientHomeBanner initialBanners={banners} />;
}

export default HomeBanner;
