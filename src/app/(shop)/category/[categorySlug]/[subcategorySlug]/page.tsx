"use client";

import React, { useEffect } from "react";
import Filter from "@/components/features/Filter";
import ProductItemCard from "@/components/features/ProductItemCard";
import { useParams } from "next/navigation";
import { ProductItemType } from "@/types/schema";
import { productItemService } from "@/services/product-item";

const ShopWithSubcategoryPage = () => {
  const { subcategorySlug } = useParams();

  const [productItems, setProductItems] = React.useState<ProductItemType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [categoryType, setCategoryType] = React.useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Gửi cả hai tham số và để API xử lý tương ứng
      const response = await productItemService.getAll({
        subcategorySlug: String(subcategorySlug),
      });

      if (response.err === false && response.data) {
        setProductItems(response.data);
        
      }

      console.log(productItems);

    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [subcategorySlug]);

  return (
    <>
      <Filter />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {isLoading ? (
          <div className="col-span-full text-center py-10">
            Loading products...
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-10 text-red-500">
            {error}
          </div>
        ) : productItems.length > 0 ? (
          productItems?.map((item) => (
            <ProductItemCard key={item.id} productItem={item} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            Chưa có sản phẩm nào trong danh mục này.
          </div>
        )}
      </div>
    </>
  );
};

export default ShopWithSubcategoryPage;
