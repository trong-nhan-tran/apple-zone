"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  Users,
  ShoppingBag,
  Activity,
} from "lucide-react";

// Sample data - replace with your actual API data in production
const monthlySales = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 8000 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 9500 },
  { month: "Jul", sales: 11000 },
  { month: "Aug", sales: 10000 },
  { month: "Sep", sales: 12500 },
  { month: "Oct", sales: 14000 },
  { month: "Nov", sales: 16000 },
  { month: "Dec", sales: 19000 },
];

const categoryData = [
  { name: "iPhone", value: 45 },
  { name: "MacBook", value: 25 },
  { name: "iPad", value: 15 },
  { name: "Apple Watch", value: 10 },
  { name: "AirPods", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const recentOrders = [
  {
    id: "1",
    customer: "Nguyen Van A",
    product: "iPhone 15 Pro",
    total: "35,990,000 ₫",
    status: "Complete",
  },
  {
    id: "2",
    customer: "Tran Thi B",
    product: "MacBook Air M2",
    total: "29,990,000 ₫",
    status: "Processing",
  },
  {
    id: "3",
    customer: "Le Van C",
    product: "Apple Watch Series 9",
    total: "11,990,000 ₫",
    status: "Complete",
  },
  {
    id: "4",
    customer: "Pham Van D",
    product: "AirPods Pro 2",
    total: "6,790,000 ₫",
    status: "Complete",
  },
  {
    id: "5",
    customer: "Hoang Van E",
    product: 'iPad Pro 13"',
    total: "24,990,000 ₫",
    status: "Processing",
  },
];

const getDashboardMetrics = () => {
  // In a real app, this would come from your API
  return {
    totalRevenue: "1,250,650,000 ₫",
    revenueChange: 15.3,
    totalOrders: 427,
    orderChange: 8.7,
    totalCustomers: 1892,
    customerChange: 12.6,
    conversionRate: 3.2,
    conversionChange: 0.8,
  };
};

const OverviewPage = () => {
  const metrics = getDashboardMetrics();

  return (
    <div className="space-y-6 mt-5">
      <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>

      {/* Dashboard Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {metrics.revenueChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  metrics.revenueChange > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(metrics.revenueChange)}%
              </span>
              <span className="text-muted-foreground ml-1">
                so với tháng trước
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {metrics.orderChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  metrics.orderChange > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(metrics.orderChange)}%
              </span>
              <span className="text-muted-foreground ml-1">
                so với tháng trước
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {metrics.customerChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  metrics.customerChange > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(metrics.customerChange)}%
              </span>
              <span className="text-muted-foreground ml-1">
                so với tháng trước
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tỷ lệ chuyển đổi
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {metrics.conversionChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  metrics.conversionChange > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(metrics.conversionChange)}%
              </span>
              <span className="text-muted-foreground ml-1">
                so với tháng trước
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Sales Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>
              Tổng doanh thu bán hàng hàng tháng
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlySales}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()} ₫`,
                      "Doanh thu",
                    ]}
                    labelFormatter={(label) => `Tháng ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="sales" name="Doanh thu" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Doanh thu theo danh mục</CardTitle>
            <CardDescription>
              Phân bố doanh thu theo danh mục sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Tỷ lệ doanh thu"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <CardDescription>
            Các đơn hàng mới nhất trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">ID</th>
                  <th className="py-3 text-left font-medium">Khách hàng</th>
                  <th className="py-3 text-left font-medium">Sản phẩm</th>
                  <th className="py-3 text-left font-medium">Tổng tiền</th>
                  <th className="py-3 text-left font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3">#{order.id}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3">{order.product}</td>
                    <td className="py-3">{order.total}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Complete"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status === "Complete"
                          ? "Hoàn thành"
                          : "Đang xử lý"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
