import React from "react";
import CategoryCard from "./CategoryCard";

type Props = {};

const CategoriesBanner = (props: Props) => {
  return (
    <div className="max-w-3/4 m-auto grid grid-cols-3 sm:grid-cols-6 gap-4 mt-16">
      <CategoryCard
        image_url="/images/category/iphone.png"
        name="iPhone"
        href="/category/iphone"
      ></CategoryCard>
      <CategoryCard
        image_url="/images/category/mac.png"
        name="Mac"
        href="/category/mac"
      ></CategoryCard>
      <CategoryCard
        image_url="/images/category/iPad.png"
        name="iPad"
        href="/category/ipad"
      ></CategoryCard>
      <CategoryCard
        image_url="/images/category/watch.png"
        name="Watch"
        href="/category/watch"
      ></CategoryCard>
      <CategoryCard
        image_url="/images/category/loa.png"
        name="Tai nghe"
        href="/category/tai-nghe"
      ></CategoryCard>
      <CategoryCard
        image_url="/images/category/phukien.png"
        name="Phụ kiện"
        href="/category/phu-kien"
      ></CategoryCard>
    </div>
  );
};

export default CategoriesBanner;
