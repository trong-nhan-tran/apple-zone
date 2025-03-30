"use client";

import ProductImageSlider from "@/components/features/ProductImageSider";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductItemType } from "@/types/schema";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";

type ProductDetailClientProps = {
  productData: ProductItemType | any;
};

const ProductDetailClient = ({ productData }: ProductDetailClientProps) => {
  const { slug } = useParams();
  const [selectedColorId, setSelectedColorId] = useState<number | null>(() => {
    // Initialize with first color if available
    if (productData?.products?.product_color_images?.length > 0) {
      return productData.products.product_color_images[0].color_id;
    }
    return null;
  });

  // Format price as VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get selected color image URLs
  const getColorImages = () => {
    if (!productData?.products?.product_color_images)
      return [productData?.thumbnail || ""];

    const selectedColor = productData.products.product_color_images.find(
      (color: any) => color.color_id === selectedColorId
    );

    return selectedColor?.urls || [productData.thumbnail];
  };

  return (
    <div className="w-3/4 mx-auto px-4 py-8">
      <div className="w-full md:flex mt-6 gap-10">
        <div className="md:w-1/2">
          <ProductImageSlider
            banners={getColorImages().map((url: any, index: number) => ({
              id: index,
              src: url,
              alt: `${productData.name} - Image ${index + 1}`,
            }))}
          />
        </div>

        <div className="md:w-1/2">
          <h1 className="font-bold text-3xl mt-2">{productData.name}</h1>
          <div className="mt-4">
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(productData.price)}
            </span>
            <span className="line-through text-gray-400 ml-3 text-lg">
              {formatPrice(productData.price * 1.1)}
            </span>
            <span className="ml-2 text-red-500">-10%</span>
          </div>

          {/* Color Selector */}
          {productData.products?.product_color_images &&
            productData.products.product_color_images.length > 0 && (
              <div className="mt-8">
                <p className="text-lg font-medium mb-3">
                  Màu -{" "}
                  <span className="capitalize">
                    {productData.products.product_color_images.find(
                      (c: any) => c.color_id === selectedColorId
                    )?.colors?.name || ""}
                  </span>
                </p>

                <div className="flex gap-4">
                  {productData.products.product_color_images.map(
                    (colorImage: any) => (
                      <div key={colorImage.id}>
                        <input
                          type="radio"
                          id={`color-${colorImage.color_id}`}
                          name="color"
                          value={colorImage.color_id}
                          className="peer hidden"
                          checked={selectedColorId === colorImage.color_id}
                          onChange={() =>
                            setSelectedColorId(colorImage.color_id)
                          }
                        />
                        <Label
                          htmlFor={`color-${colorImage.color_id}`}
                          className={`w-12 h-12 rounded-full cursor-pointer border-2
                        ${
                          selectedColorId === colorImage.color_id
                            ? "border-blue-500"
                            : "border-gray-300"
                        } 
                        hover:border-blue-400 transition-all`}
                          style={{ backgroundColor: colorImage.colors?.code }}
                          title={colorImage.colors?.name}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Storage Options as Links */}
          {productData.products?.product_items &&
            productData.products.product_items.length > 0 && (
              <div className="mt-8">
                <p className="text-lg font-medium mb-3">
                  {productData.option_name}
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {productData.products.product_items.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      title={item.name}
                      className={`w-full rounded-2xl p-3 border-2 
                      flex justify-between items-center transition-colors
                      ${
                        item.slug === slug
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <span className="font-bold text-lg">
                        {item.option_value}
                      </span>
                      <div className="flex flex-col items-end text-lg">
                        <span
                          className={
                            item.slug === slug
                              ? "text-blue-600 font-medium"
                              : ""
                          }
                        >
                          {formatPrice(item.price)}
                        </span>
                        <span className="line-through text-gray-400 text-sm">
                          {formatPrice(item.price * 1.1)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          <Button className="mt-10 h-14 text-lg w-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
            Thêm vào giỏ hàng
          </Button>

          {/* Product details section */}
          {/* <div className="mt-8 border-t pt-6">
            <h3 className="font-medium text-xl mb-3">Thông tin sản phẩm</h3>
            <div className="prose max-w-none">
              <p>Sản phẩm chính hãng Apple Việt Nam</p>
              <p>Bảo hành 12 tháng</p>
              <p>Giao hàng miễn phí toàn quốc</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
