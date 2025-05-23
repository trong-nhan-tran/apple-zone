"use client";

import { useEffect, useState } from "react";
import { ProductItemType } from "@/schemas";
import SimpleModal from "@/components/ui-custom/simple-modal";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui-shadcn/tabs";
import { Info, Package } from "lucide-react";
import StockTable from "./stock-table/stock-table";
import InfoSection from "./infor-section";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: ProductItemType | null;
  onSuccess?: () => void;
  editMode?: boolean;
  productId?: string;
};

const ProductItemForm = ({
  open,
  setOpen,
  itemToEdit,
  onSuccess,
  editMode = false,
  productId,
}: Props) => {
  const [activeTab, setActiveTab] = useState("general");
  const [currentProductItem, setCurrentProductItem] =
    useState<ProductItemType | null>(itemToEdit || null);

  // Handle success from InfoSection
  const handleInfoSectionSuccess = (data: ProductItemType) => {
    setCurrentProductItem(data);

    // If it's not edit mode, switch to stocks tab
    if (!editMode) {
      setActiveTab("stocks");
    }

    // Call the parent onSuccess handler if provided
    if (onSuccess) {
      onSuccess();
    }
  };
  useEffect(() => {
    if (open) {
      setCurrentProductItem(itemToEdit || null);
    }
  }, [open, itemToEdit]);
  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode
          ? `Sửa sản phẩm con ${
              currentProductItem?.name ? `- ${currentProductItem.name}` : ""
            }`
          : "Thêm sản phẩm con"
      }
      className="max-w-4xl bg-white min-h-fit overflow-y-auto"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Thông tin chung
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="stocks"
            disabled={!currentProductItem?.id && !editMode}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Quản lý tồn kho
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <InfoSection
            productItem={itemToEdit}
            onSuccess={handleInfoSectionSuccess}
            editMode={editMode}
            open={open}
            productId={productId}
          />
        </TabsContent>

        <TabsContent value="stocks" className="pt-4">
          <StockTable productItem={itemToEdit || null} onSuccess={onSuccess} />
        </TabsContent>
      </Tabs>
    </SimpleModal>
  );
};

export default ProductItemForm;
