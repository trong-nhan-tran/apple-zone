import { productItemService } from "@/services/product-item-service";
import ProductItemCard from "@/components/features/ProductItemCard";
import Filter from "@/components/layout/shop-filter";
import { product_items } from "@prisma/client";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q as string;
  let products: product_items[] = [];
  let error: string | null = null;

  if (query) {
    try {
      const response = await productItemService.searchProducts(query);
      if (response.success) {
        products = response.data;
      } else {
        error = response.message;
      }
    } catch (err) {
      error = "An error occurred while searching";
    }
  }

  return (
    <div className="w-full md:max-w-4/5 md:mx-auto">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold my-6">
          {query ? `Kết quả tìm kiếm cho "${query}"` : "Tìm kiếm"}
        </h1>
      </div>

      <Filter />
      <div className="grid mx-4 md:mx-0 grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {error ? (
          <div className="col-span-full text-center py-10 text-red-500">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-10">
            Không tìm thấy sản phẩm. Vui lòng thử từ khóa khác.
          </div>
        ) : (
          products.map((product) => (
            <ProductItemCard key={product.id} productItem={product} />
          ))
        )}
      </div>
    </div>
  );
}

// Add metadata for the page
export async function generateMetadata({ searchParams }: Props) {
  const query = searchParams.q as string;

  return {
    title: query ? `Tìm kiếm: ${query} - Apple Zone` : "Tìm kiếm - Apple Zone",
    description: query
      ? `Kết quả tìm kiếm cho "${query}" trên Apple Zone`
      : "Tìm kiếm sản phẩm trên Apple Zone",
  };
}
