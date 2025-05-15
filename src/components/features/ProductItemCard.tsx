import { ProductItemType } from "@/schemas";
import Link from "next/link";
import Image from "next/image";

type Props = {
  productItem: ProductItemType;
};

const ProductItemCard = ({ productItem }: Props) => {
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
    <Link
      href={`/product/${productItem?.slug || ""}`}
      className="bg-white dark:bg-neutral-700 block rounded-2xl text-center transform transition-transform duration-300 hover:scale-103 py-6 px-4"
    >
      <Image
        className="m-auto object-contain"
        src={String(productItem?.thumbnail)}
        alt={productItem?.name}
        width={240}
        height={240}
      />

      <h2 className="mt-4 font-medium">{productItem?.name}</h2>

      <div className="">
        <span className="font-bold text-red-600 dark:text-red-400">
          {formatPrice(productItem.price) || "Chưa có giá"}
        </span>
        <div>
          <span className="line-through text-gray-400 ml-2 text-sm">
            {formatPrice((productItem?.price || 0) * 1.1)}
          </span>
          <span className="ml-1 text-sm text-red-500">-10%</span>
        </div>
      </div>

      <div className="text-amber-500 mt-1 text-sm">Online giá rẻ quá</div>
    </Link>
  );
};

export default ProductItemCard;
