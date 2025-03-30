"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Printer, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Sample data for orders
export const data: Order[] = [
  {
    id: "ORD-001",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@example.com",
    customerPhone: "0901234567",
    orderDate: new Date("2025-02-15T08:30:00"),
    total: 35990000,
    status: "completed",
    paymentMethod: "COD",
    items: [{ name: "iPhone 15 Pro", quantity: 1, price: 35990000 }],
    shippingAddress: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  },
  {
    id: "ORD-002",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@example.com",
    customerPhone: "0912345678",
    orderDate: new Date("2025-02-16T14:25:00"),
    total: 29990000,
    status: "processing",
    paymentMethod: "Banking",
    items: [{ name: "MacBook Air M2", quantity: 1, price: 29990000 }],
    shippingAddress: "456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
  },
  {
    id: "ORD-003",
    customerName: "Lê Văn C",
    customerEmail: "levanc@example.com",
    customerPhone: "0923456789",
    orderDate: new Date("2025-02-18T09:15:00"),
    total: 11990000,
    status: "completed",
    paymentMethod: "Banking",
    items: [{ name: "Apple Watch Series 9", quantity: 1, price: 11990000 }],
    shippingAddress: "789 Đường Hàm Nghi, Quận 1, TP. Hồ Chí Minh",
  },
  {
    id: "ORD-004",
    customerName: "Phạm Văn D",
    customerEmail: "phamvand@example.com",
    customerPhone: "0934567890",
    orderDate: new Date("2025-02-19T16:45:00"),
    total: 6790000,
    status: "completed",
    paymentMethod: "COD",
    items: [{ name: "AirPods Pro 2", quantity: 1, price: 6790000 }],
    shippingAddress: "101 Đường Võ Văn Tần, Quận 3, TP. Hồ Chí Minh",
  },
  {
    id: "ORD-005",
    customerName: "Hoàng Văn E",
    customerEmail: "hoangvane@example.com",
    customerPhone: "0945678901",
    orderDate: new Date("2025-02-21T11:30:00"),
    total: 24990000,
    status: "processing",
    paymentMethod: "Banking",
    items: [{ name: 'iPad Pro 13"', quantity: 1, price: 24990000 }],
    shippingAddress:
      "202 Đường Đinh Công Tráng, Quận Bình Thạnh, TP. Hồ Chí Minh",
  },
  {
    id: "ORD-006",
    customerName: "Trịnh Thị F",
    customerEmail: "trinhthif@example.com",
    customerPhone: "0956789012",
    orderDate: new Date("2025-02-22T10:20:00"),
    total: 19990000,
    status: "cancelled",
    paymentMethod: "Banking",
    items: [{ name: 'iPad Pro 11"', quantity: 1, price: 19990000 }],
    shippingAddress: "303 Đường Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh",
  },
  {
    id: "ORD-007",
    customerName: "Ngô Văn G",
    customerEmail: "ngovang@example.com",
    customerPhone: "0967890123",
    orderDate: new Date("2025-02-25T13:40:00"),
    total: 63780000,
    status: "processing",
    paymentMethod: "COD",
    items: [
      { name: "iPhone 15 Pro", quantity: 1, price: 35990000 },
      { name: "AirPods Pro 2", quantity: 2, price: 13890000 },
      { name: "Apple Watch SE", quantity: 1, price: 13900000 },
    ],
    shippingAddress: "404 Đường Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh",
  },
];

// Types for order data
export type OrderStatus = "processing" | "completed" | "cancelled";
export type PaymentMethod = "COD" | "Banking";

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: Date;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  shippingAddress: string;
};

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get status badge styling
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          Hoàn thành
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 hover:bg-blue-100"
        >
          Đang xử lý
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 hover:bg-red-100"
        >
          Đã hủy
        </Badge>
      );
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

// Columns definition
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã đơn hàng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Khách hàng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("customerName")}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.customerPhone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày đặt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("orderDate") as Date;
      return (
        <div className="flex flex-col">
          <div className="font-medium">
            {format(date, "dd/MM/yyyy", { locale: vi })}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(date, "HH:mm", { locale: vi })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tổng tiền
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("total") as number;
      return <div className="font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Thanh toán",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as PaymentMethod;
      return <div>{method === "COD" ? "Tiền mặt (COD)" : "Chuyển khoản"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Hành động",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
                <span className="sr-only">Xem chi tiết</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Chi tiết đơn hàng #{order.id}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm">
                      Thông tin khách hàng
                    </h3>
                    <div className="mt-1">
                      <p>{order.customerName}</p>
                      <p>{order.customerEmail}</p>
                      <p>{order.customerPhone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">Địa chỉ giao hàng</h3>
                    <p className="mt-1">{order.shippingAddress}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">
                      Phương thức thanh toán
                    </h3>
                    <p className="mt-1">
                      {order.paymentMethod === "COD"
                        ? "Tiền mặt (COD)"
                        : "Chuyển khoản"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm">Thông tin đơn hàng</h3>
                  <div className="mt-2 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Ngày đặt hàng:</span>
                      <span>
                        {format(order.orderDate, "HH:mm - dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trạng thái:</span>
                      <span>{getStatusBadge(order.status)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold">Sản phẩm đã đặt</h3>
                <div className="mt-2 border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Sản phẩm
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          SL
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Đơn giá
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3 text-sm">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-sm text-right font-medium"
                        >
                          Tổng cộng:
                        </td>
                        <td className="px-4 py-3 text-right font-bold">
                          {formatCurrency(order.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  {order.status === "processing" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Hủy đơn
                    </Button>
                  )}
                  {order.status === "processing" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex items-center bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Hoàn thành
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  In đơn hàng
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="icon" className="h-8 w-8 p-0">
            <Printer className="h-4 w-4" />
            <span className="sr-only">In đơn hàng</span>
          </Button>

          {order.status === "processing" && (
            <Button variant="destructive" size="icon" className="h-8 w-8 p-0">
              <XCircle className="h-4 w-4" />
              <span className="sr-only">Hủy đơn</span>
            </Button>
          )}

          {order.status === "processing" && (
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="sr-only">Hoàn thành</span>
            </Button>
          )}
        </div>
      );
    },
  },
];
