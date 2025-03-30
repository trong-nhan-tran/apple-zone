"use client";

import React, { useEffect } from "react";
import Filter from "@/components/features/Filter";
import ProductCard from "@/components/features/ProductCard";
import { useParams } from "next/navigation";
import { ProductType } from "@/types/schema";
import { productService } from "@/services/product";

const ShopWithCategoryPage = () => {
  const { categorySlug } = useParams();

  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [categoryType, setCategoryType] = React.useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Gửi cả hai tham số và để API xử lý tương ứng
      const response = await productService.getAll({
        categorySlug: String(categorySlug),
      });
      if (response.err === false && response.data) {
        setProducts(response.data);
        setCategoryType(response.data[0]?.categories?.name || null);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

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
        ) : products.length > 0 ? (
          products?.map((product) => (
            <ProductCard key={product.id} product={product} />
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

export default ShopWithCategoryPage;
