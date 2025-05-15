import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "./components/product-detail";
import { productItemService } from "@/services/product-item-service";
import { cache } from "react";
import { ProductItemWithDetailType } from "@/schemas";

type PageParams = {
  params: {
    slug: string;
  };
};

const getProductDetail = cache(async (slug: string) => {
  const response = await productItemService.getBySlug(slug);

  if (!response.success || !response.data || response.data.length === 0) {
    return null;
  }

  return response.data[0];
});

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const productData = await getProductDetail(params.slug);

  if (!productData) {
    return {
      title: "Product Not Found | Apple Zone",
      description: "The requested product could not be found",
    };
  }

  return {
    title: `${productData.name} | Apple Zone`,
    description: `Buy ${productData.name} at the best price. Original Apple product with warranty.`,
    openGraph: {
      images: [productData.thumbnail],
      title: productData.name,
      description: `Buy ${productData.name} at the best price.`,
    },
  };
}

export default async function ProductPage({ params }: PageParams) {
  const productDetail: ProductItemWithDetailType = await getProductDetail(
    params.slug
  );
  console.log("Product Detail: ", productDetail);

  if (!productDetail) {
    notFound();
  }

  return <ProductDetail productData={productDetail} />;
}
