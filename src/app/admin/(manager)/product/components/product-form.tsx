"use client";

import { useState, useEffect } from "react";
import { ProductType } from "@/schemas";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui-shadcn/tabs";
import { Info, Palette } from "lucide-react";
import GeneralInfo from "./main-infor/infor-section";
import SimpleModal from "@/components/ui-custom/simple-modal";
import ColorImagesTable from "./color-table/colors-table";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: ProductType | null;
  onSuccess?: () => void;
  editMode?: boolean;
};

const ProductForm = ({
  open,
  setOpen,
  onSuccess,
  editMode = false,
  itemToEdit,
}: Props) => {
  const [activeTab, setActiveTab] = useState("general");
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(
    itemToEdit || null
  );

  useEffect(() => {
    if (open) {
      setCurrentProduct(itemToEdit || null);
    }
  }, [open, itemToEdit]);

  const handleGeneralInfoSuccess = (data: ProductType) => {
    // Your success handling
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode
          ? `Sửa sản phẩm ${
              currentProduct?.name ? `- ${currentProduct.name}` : ""
            }`
          : "Thêm sản phẩm"
      }
      className="max-w-6xl bg-white"
    >
      <div className="">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Thông tin chung
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="colors"
              disabled={!currentProduct?.id && !editMode}
            >
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Màu sắc & Hình ảnh
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="pt-4">
            <GeneralInfo
              product={itemToEdit}
              onSuccess={onSuccess}
              editMode={editMode}
              setOpen={setOpen}
              open={open}
            />
          </TabsContent>

          <TabsContent value="colors" className="pt-4">
            <ColorImagesTable
              product={itemToEdit || null}
              onSuccess={onSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>
    </SimpleModal>
  );
};

export default ProductForm;
