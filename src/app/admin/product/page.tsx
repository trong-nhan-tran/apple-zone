"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonWithTooltip } from "@/components/ui-custom/button-with-tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { categoryService } from "@/services/category";
import { productService } from "@/services/product";
import { colorService } from "@/services/color";
import { CategoryType, ProductType, ColorType } from "@/types/schema";
import React, { useEffect, useState } from "react";
import ProductForm from "./product-form";
import ProductItemsModal from "./product-items";
import { toast } from "react-toastify";

type Props = {};

const ProductPage = (props: Props) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [productToEdit, setProductToEdit] = useState<ProductType | null>(
    null
  );
  const [isEditForm, setIsEditForm] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<ProductType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [openFormProduct, setOpenFormProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openProductItemsModal, setOpenProductItemsModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [colors, setColors] = useState<ColorType[]>([]);

  const fetchColors = async () => {
      try {
        setIsLoading(true);
        const response = await colorService.getAll();
        if (response.err === false && response.data) {
          setColors(response.data);
        }
      } catch (error) {
        console.log("Error fetching colors:", error);
        toast.error("Không thể tải danh sách màu sắc.");
      } finally {
        setIsLoading(false);
      }
    };

  const fetchProducts = async (keyword?: string) => {
    try {
      setIsLoading(true);
      const response = await productService.getAll({ keyword });
      if (response.err === false && response.data) {
        setProducts(response.data);
      } 
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.err === false && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };
  const check = false

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchColors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchKeyword);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete.id!);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast.success("Đã xóa dòng sản phẩm thành công");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Không thể xóa dòng sản phẩm");
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };


  return (
    <div className="">
      <ProductForm
        open={openFormProduct}
        setOpen={setOpenFormProduct}
        product={productToEdit}
        categories={categories}
        isEdit={isEditForm}
        colors={colors}
        onSuccess={() => {
          fetchProducts();
          setOpenFormProduct(false);
        }}
      />

      <ProductItemsModal
        open={openProductItemsModal}
        setOpen={setOpenProductItemsModal}
        product={productToEdit}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa dòng sản phẩm "{productToDelete?.name}"?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="sm:flex justify-between items-center my-5">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Dòng sản phẩm</h1>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              placeholder="Tìm kiếm"
              className="max-w-sm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button type="submit">
              <i className="bi bi-search"></i>
            </Button>
          </form>

          <Button
            type="button"
            onClick={() => {
              setProductToEdit(null);
              setOpenFormProduct(true);
              setIsEditForm(false);
            }}
            className="bg-blue-500 hover:bg-blue-300"
          >
            <i className="bi bi-plus mr-1"></i>
            <span>Thêm mới</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="bi bi-inbox text-4xl"></i>
          <p className="mt-2">Không tìm thấy dòng sản phẩm nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr className="divide-x divide-gray-200">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Tên dòng sản phẩm
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Ảnh đại diện
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Danh mục
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Lựa chọn
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                // const productColors = getProductColors(product);

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 divide-x divide-gray-200"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {product.thumbnail? (
                        <img
                          src={product.thumbnail}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      ): <span className="text-gray-500">Không có ảnh</span>}
                      
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                      {product.categories?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.product_color_images && product.product_color_images.length > 0 ? (
                          product.product_color_images.map((items) => (
                            <span
                              key={items.id}
                              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700"
                            >
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: items.colors?.code || "#000000" }}
                              ></span>
                              {items.colors?.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">Chưa có màu</span>
                        )}
                        
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex gap-2">
                        <ButtonWithTooltip
                          type="button"
                          tooltip="Chỉnh sửa"
                          variant="primary"
                          size="icon"
                          className="h-9 w-9 p-0"
                          onClick={() => {
                            setProductToEdit(product);
                            setOpenFormProduct(true);
                            setIsEditForm(true);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </ButtonWithTooltip>
                        <ButtonWithTooltip
                          type="button"
                          tooltip="Quản lý biến thể"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 p-0"
                          onClick={() => {
                            setProductToEdit(product);
                            setOpenProductItemsModal(true);
                          }}
                        >
                          <i className="bi bi-list-nested"></i>
                        </ButtonWithTooltip>
                        <ButtonWithTooltip
                          type="button"
                          tooltip="Xóa"
                          variant="destructive"
                          size="icon"
                          className="h-9 w-9 p-0"
                          onClick={() => {
                            setProductToDelete(product);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </ButtonWithTooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
