"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { data, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { AddOrderModal } from "./add-modal";
import { Input } from "@/components/ui/input";

type Props = {};

const OrderManagerPage = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="">
      <div className="sm:flex justify-between items-center my-5">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Đơn hàng</h1>
        <div className="flex items-center gap-2 ">
          <div className="flex items-center gap-2">
            <Input placeholder="Tìm kiếm" className="max-w-sm" />
            <Button>
              <i className="bi bi-search"></i>
            </Button>
          </div>

          <Button
            type="submit"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-500 hover:bg-blue-300"
          >
            <i className="bi bi-plus"></i>
            <span>Thêm mới</span>
          </Button>
        </div>
      </div>
      <AddOrderModal open={isOpen} setOpen={setIsOpen} />
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default OrderManagerPage;
