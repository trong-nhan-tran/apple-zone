import HomeBanner from "@/components/features/HomeBanner";
// import FlashSale from "@/components/features/FlashSale";
import CategoryMenu from "@/components/features/CategoryMenu";
import ProductSlider from "@/components/features/ProductSlider";
import { productItemService } from "@/services";

export const dynamic = "force-dynamic"; // Đảm bảo dữ liệu luôn mới, có thể đổi thành 'force-static' nếu muốn static generation

export default async function Home() {
  // Fetch dữ liệu song song cho tất cả categories
  const categorySlug = [
    "iphone",
    "mac",
    "ipad",
    "watch",
    "tai-nghe",
    "phu-kien",
  ];
  const categoryPromises = categorySlug.map((slug) =>
    productItemService.getHomeCategoryProducts(slug, 10)
  );
  const categoryResults = await Promise.all(categoryPromises);
  console.log(categoryResults);
  const iPhoneProducts = categoryResults[0].data;
  const macProducts = categoryResults[1].data;
  const iPadProducts = categoryResults[2].data;
  const watchProducts = categoryResults[3].data;
  const airpodsProducts = categoryResults[4].data;
  const accessoryProducts = categoryResults[5].data;

  return (
    <>
      <HomeBanner></HomeBanner>
      {/* <FlashSale></FlashSale> */}
      <CategoryMenu></CategoryMenu>
      <ProductSlider name="iPhone" products={iPhoneProducts}></ProductSlider>
      <ProductSlider name="Mac" products={macProducts}></ProductSlider>
      <ProductSlider name="iPad" products={iPadProducts}></ProductSlider>
      <ProductSlider name="Watch" products={watchProducts}></ProductSlider>
      <ProductSlider
        name="Tai nghe"
        visibleLogo={false}
        products={airpodsProducts}
      ></ProductSlider>
      <ProductSlider
        name="Phụ kiện"
        visibleLogo={false}
        products={accessoryProducts}
      ></ProductSlider>
    </>
  );
}
