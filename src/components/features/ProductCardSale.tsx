import React from "react";
import Image from "next/image";
type Props = {};

const ProductCardSale = (props: Props) => {
  return (
    <div className="bg-white rounded-2xl p-2">
      <Image src="/images/product/macbook.png" width={180} height={300} alt="Product image"/>
      <div className="text-center">
      <p className="w-43">Macbook Pro 16 inch M3 Max 96GB/1TB</p>
      <div className="text-amber-500 font-bold text-xl">90.000.000đ</div>
      <div className="text-l line-through text-gray-400">100.000.000đ</div>

      </div>
    </div>
  );
};

export default ProductCardSale;
