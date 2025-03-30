"use client";
import { ProductType } from "@/types/schema";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

type Props = {
  product: ProductType;
};

const ProductCard = ({ product }: Props) => {
  // State for selected product item only
  const [selectedProductItem, setSelectedProductItem] = useState(
    product?.product_items?.[0] || null
  );

  const handleProductItemChange = (productItem: any, e: React.MouseEvent) => {
    // Prevent the event from bubbling up to the Link component
    e.preventDefault();
    e.stopPropagation();
    setSelectedProductItem(productItem);
  };

  // Format price as VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/product/${selectedProductItem?.slug || ""}`} passHref>
      <div className="bg-white block rounded-2xl text-center transform transition-transform duration-300 hover:scale-103 py-4 px-4 cursor-pointer">
        <Image
          className="m-auto"
          src={String(product?.thumbnail)}
          alt={product?.name}
          width={240}
          height={240}
        />
        {/* Product item options (capacity) */}
        <div
          className="flex flex-wrap justify-center gap-2 mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          {product?.product_items?.map((item) => (
            <button
              key={item.id}
              className={`px-4 py-2 text-sm rounded-lg border hover:border-black ${
                selectedProductItem?.id === item.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={(e) => handleProductItemChange(item, e)}
            >
              {item.option_value}
            </button>
          ))}
        </div>

        <h2 className="mt-4 font-medium">{product?.name}</h2>

        <div className="">
          <span className="font-bold text-red-600">
            {selectedProductItem ? formatPrice(selectedProductItem.price) : "0"}
          </span>
          <span className="line-through text-gray-400 ml-2 text-sm">
            {formatPrice((selectedProductItem?.price || 0) * 1.1)}
          </span>
          <span className="ml-1 text-sm text-red-500">-10%</span>
        </div>

        <div className="text-amber-500 mt-1 text-sm">Online giá rẻ quá</div>
      </div>
    </Link>
  );
};

export default ProductCard;
