"use client";

import { useState, useEffect } from "react";
import { OrderType } from "@/schemas";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui-shadcn/tabs";
import { UserRound, ShoppingBag } from "lucide-react";
import CustomerInfo from "./customer-info/customer-info";
import SimpleModal from "@/components/ui-custom/simple-modal";
import OrderItemsTable from "./order-items/order-items-table";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: OrderType | null;
  onSuccess?: () => void;
  editMode?: boolean;
};

const OrderFormModal = ({
  open,
  setOpen,
  onSuccess,
  editMode = false,
  itemToEdit,
}: Props) => {
  const [activeTab, setActiveTab] = useState("customer");
  const [currentOrder, setCurrentOrder] = useState<OrderType | null>(
    itemToEdit || null
  );

  useEffect(() => {
    if (open) {
      setCurrentOrder(itemToEdit || null);
    }
  }, [open, itemToEdit]);

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode
          ? `Sửa đơn hàng ${currentOrder?.id ? `#${currentOrder.id}` : ""}`
          : "Thêm đơn hàng"
      }
      className="max-w-6xl bg-white"
    >
      <div className="">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">
              <span className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                Thông tin khách hàng
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="items"
              disabled={!currentOrder?.id && !editMode}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Chi tiết đơn hàng
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="pt-4">
            <CustomerInfo
              order={itemToEdit || null}
              onSuccess={handleSuccess}
              editMode={editMode}
              setOpen={setOpen}
              open={open}
            />
          </TabsContent>

          <TabsContent value="items" className="pt-4">
            <OrderItemsTable
              order={itemToEdit || null}
              onSuccess={handleSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>
    </SimpleModal>
  );
};

export default OrderFormModal;
