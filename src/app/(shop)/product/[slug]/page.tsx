import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

// Định nghĩa kiểu params cho generateMetadata và hàm page
type PageParams = {
  params: {
    slug: string;
  };
};

// Thêm generateMetadata để tối ưu SEO
export async function generateMetadata({ params }: PageParams) {
  const { slug } = params;

  // Fetch product data
  const productData = await getProductBySlug(slug);

  if (!productData) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found",
    };
  }

  return {
    title: `${productData.name} | Apple Zone`,
    description: `Buy ${productData.name} at the best price. Original Apple product with warranty.`,
    openGraph: {
      images: [productData.thumbnail],
    },
  };
}

// Hàm helper để lấy dữ liệu sản phẩm
async function getProductBySlug(slug: string) {
  try {
    const productItem = await prisma.product_items.findFirst({
      where: { slug },
      include: {
        products: {
          include: {
            product_items: true,
            product_color_images: {
              include: {
                colors: true,
              },
            },
          },
        },
        subcategories: {
          include: {
            categories: true,
          },
        },
      },
    });

    return productItem;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

// Server component chính
export default async function ProductPage({ params }: PageParams) {
  const { slug } = params;

  // Fetch product data
  const productData = await getProductBySlug(slug);

  // Xử lý trường hợp không tìm thấy sản phẩm
  if (!productData) {
    notFound();
  }

  // Truyền dữ liệu đã fetch xuống client component
  return <ProductDetailClient productData={productData} />;
}
