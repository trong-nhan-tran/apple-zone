import HomeBanner from "@/components/features/HomeBanner";
import FlashSale from "@/components/features/FlashSale";
import CategoryMenu from "@/components/features/CategoryMenu";
import ProductSlider from "@/components/features/ProductSlider";
import { getHomeCategoryProducts } from "@/services/home";

export const dynamic = "force-dynamic"; // Đảm bảo dữ liệu luôn mới, có thể đổi thành 'force-static' nếu muốn static generation

export default async function Home() {
  // Fetch dữ liệu song song cho tất cả categories
  const categoryNames = [
    "iPhone",
    "Mac",
    "iPad",
    "Watch",
    "Tai nghe",
    "Phụ kiện",
  ];
  const PRODUCTS_PER_CATEGORY = 14;

  const categoryProductsPromises = categoryNames.map((category) =>
    getHomeCategoryProducts(category, PRODUCTS_PER_CATEGORY)
  );

  const categoryProducts = await Promise.all(categoryProductsPromises);

  // Map category products to respective objects
  const [
    iPhoneProducts,
    macProducts,
    iPadProducts,
    watchProducts,
    airpodsProducts,
    accessoryProducts,
  ] = categoryProducts;

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
        name="AirPods"
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
