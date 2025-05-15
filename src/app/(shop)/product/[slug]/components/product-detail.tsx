"use client";

import ImageSlider from "./images-slider";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui-shadcn/button";
import { ProductItemWithDetailType } from "@/schemas";
import { useParams, useRouter } from "next/navigation";
import ProductDescription from "./description";
import { useCartStore } from "@/stores/cart-store";
import { Check, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/libs/utils";
import SelectColor from "./select-color";
import SelectOption from "./select-option";
import { CartItem } from "@/schemas/cart-item-schema";

type Props = {
  productData: ProductItemWithDetailType;
};

const ProductDetail = ({ productData }: Props) => {
  const { slug } = useParams();
  const { addItem } = useCartStore();
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [colorImages, setColorImages] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get all unique colors from the stocks array and filter out null values
  const availableColors = productData.stocks
    ? productData.stocks
        .map((stock) => stock.product_colors)
        .filter((color): color is NonNullable<typeof color> => color !== null)
    : [];

  useEffect(() => {
    if (productData.stocks && productData.stocks.length > 0) {
      const firstColor = productData.stocks[0].product_colors;
      if (firstColor) {
        setSelectedColorId(firstColor.id);
        setSelectedColor(firstColor);

        // Set initial images from the first color
        if (firstColor.images && firstColor.images.length > 0) {
          setColorImages(firstColor.images);
        } else if (firstColor.thumbnail) {
          setColorImages([firstColor.thumbnail]);
        }
      }
    }
  }, [productData]);

  // Update images and selected color when color selection changes
  useEffect(() => {
    if (selectedColorId && productData.stocks) {
      const stockWithSelectedColor = productData.stocks.find(
        (stock) =>
          stock.product_colors && stock.product_colors.id === selectedColorId
      );

      if (stockWithSelectedColor && stockWithSelectedColor.product_colors) {
        const currentColor = stockWithSelectedColor.product_colors;
        setSelectedColor(currentColor);

        if (currentColor.images && currentColor.images.length > 0) {
          setColorImages(currentColor.images);
        } else if (currentColor.thumbnail) {
          setColorImages([currentColor.thumbnail]);
        } else {
          setColorImages([productData.thumbnail || ""]);
        }
      }
    }
  }, [selectedColorId, productData]);

  // Handle adding the product to cart
  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    setIsAddingToCart(true);
    try {
      const cartItem: CartItem = {
        product_item_id: productData.id,
        quantity: 1,
        color_name: selectedColor.color_name,
        thumbnail: selectedColor.thumbnail || productData.thumbnail || "",
        price: productData.price,
        slug: productData.slug || "",
        option_name: productData.option_name || "",
        option_value: productData.option_value || "",
        product_name: productData.name || "",
      };

      addItem(cartItem);
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="w-3/4 mx-auto px-4 py-8">
      <div className="w-full md:flex mt-6 gap-10">
        <div className="md:w-1/2">
          <ImageSlider
            images={colorImages.map((url: string, index: number) => ({
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

          {/* Color selection component */}

          <SelectColor
            colors={availableColors}
            selectedColorId={selectedColorId}
            onSelectColor={setSelectedColorId}
          />

          <SelectOption
            optionName={productData.option_name}
            items={productData.products?.product_items || []}
            currentSlug={String(slug)}
          />

          <Button
            className="mt-10 h-14 text-lg w-full bg-blue-500 hover:bg-blue-600 cursor-pointer"
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedColorId}
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5" /> Đã thêm
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> Thêm vào giỏ hàng
              </span>
            )}
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <ProductDescription
          description={productData.products?.description || null}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
