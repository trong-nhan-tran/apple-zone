"use client";

import React, { useState, useEffect } from "react";
import CartItem from "@/components/features/CartItem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui-custom/combobox";
import { Button } from "@/components/ui/button";

type Props = {};

// Dữ liệu mẫu, thực tế nên lấy từ API
const provinces = [
  { value: "cantho", label: "Cần Thơ" },
  { value: "haugiang", label: "Hậu Giang" },
  { value: "hochiminh", label: "Hồ Chí Minh" },
];

const districts = {
  cantho: [
    { value: "ninhkieu", label: "Ninh Kiều" },
    { value: "binhthuỷ", label: "Bình Thuỷ" },
    { value: "cairang", label: "Cái Răng" },
  ],
  haugiang: [
    { value: "vithuy", label: "Vị Thuỷ" },
    { value: "longmỹ", label: "Long Mỹ" },
  ],
  hochiminh: [
    { value: "quan1", label: "Quận 1" },
    { value: "quan2", label: "Quận 2" },
    { value: "quan3", label: "Quận 3" },
  ],
};

const wards = {
  ninhkieu: [
    { value: "tananlac", label: "Tân An Lạc" },
    { value: "xuankhanh", label: "Xuân Khánh" },
  ],
  binhthuỷ: [
    { value: "binhthuỷ", label: "Bình Thuỷ" },
    { value: "tranhung", label: "Trà Nóc" },
  ],
  cairang: [
    { value: "lehongphong", label: "Lê Hồng Phong" },
    { value: "hungphu", label: "Hưng Phú" },
  ],
  vithuy: [
    { value: "vithanh", label: "Vị Thanh" },
    { value: "vitrung", label: "Vị Trung" },
  ],
  longmỹ: [
    { value: "longmỹ", label: "Long Mỹ" },
    { value: "vilong", label: "Vị Long" },
  ],
  quan1: [
    { value: "bennghe", label: "Bến Nghé" },
    { value: "cautreho", label: "Cầu Tre Ho" },
  ],
  quan2: [
    { value: "thuduc", label: "Thủ Đức" },
    { value: "anphu", label: "An Phú" },
  ],
  quan3: [
    { value: "phuong1", label: "Phường 1" },
    { value: "phuong2", label: "Phường 2" },
  ],
};

const CartPage = (props: Props) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [districtOptions, setDistrictOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [wardOptions, setWardOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Cập nhật danh sách quận/huyện khi chọn tỉnh/thành
  useEffect(() => {
    if (selectedProvince) {
      setDistrictOptions(
        districts[selectedProvince as keyof typeof districts] || []
      );
      setSelectedDistrict(""); // Reset quận/huyện đã chọn
      setSelectedWard(""); // Reset phường/xã đã chọn
    } else {
      setDistrictOptions([]);
    }
  }, [selectedProvince]);

  // Cập nhật danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      setWardOptions(wards[selectedDistrict as keyof typeof wards] || []);
      setSelectedWard(""); // Reset phường/xã đã chọn
    } else {
      setWardOptions([]);
    }
  }, [selectedDistrict]);

  return (
    <div className="flex flex-col w-full md:max-w-1/2 m-auto mt-0 md:mt-5 rounded-2xl bg-white  p-4">
      <div className="w-full p-6 ">
        <h2 className="font-bold mb-4 text-2xl">Giỏ hàng</h2>
        <CartItem />
        {/* <CartItem /> */}
        <div className="flex w-full items-center space-x-2 mb-6">
          <Input className="h-12" type="text" placeholder="Nhập mã giảm giá" />
          <Button
            className="h-12 bg-blue-500 cursor-pointer hover:bg-blue-400 transition-all"
            type="submit"
          > 
            Áp dụng voucher
          </Button>
        </div>
        <div className="">
          <div className="flex justify-between mb-2 border-b-1">
            <span className="">Tạm tính </span>

            <span className="">62.000.000d</span>
          </div>
          <div className="flex justify-between mb-2 border-b-1">
            <span className="">Giảm giá </span>
            <span className="">0đ</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="">Tổng</span>
            <span className="">62.000.000đ</span>
          </div>
        </div>
      </div>
      <div className="p-6 w-full">
        <div className="mb-6">
          <h3 className="font-bold mb-4 text-lg">Thông tin khách hàng</h3>
          <div className="flex space-x-4 ">
            <div className="w-full">
              <Label className="mb-2" htmlFor="name">
                Họ và Tên
              </Label>
              <Input
                className="h-13"
                placeholder="Họ và Tên"
                type="text"
              ></Input>
            </div>
            <div className="w-full">
              <Label className="mb-2" htmlFor="phone">
                Số điện thoại
              </Label>
              <Input
                className="h-13"
                placeholder="Số điện thoại"
                type="text"
              ></Input>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t-1 border-gray-200">
          <h3 className="font-bold mb-4 text-lg">Chọn hình thức nhận hàng</h3>
          <Tabs defaultValue="1" className="bg-zinc-50 rounded-2xl p-2">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-white mb-4">
              <TabsTrigger value="1">Giao tận nơi</TabsTrigger>
              <TabsTrigger value="2">Nhận tại cửa hàng</TabsTrigger>
            </TabsList>
            <TabsContent className="" value="1">
              <div className="space-x-2 flex mb-4">
                <Combobox
                  className="w-full h-13"
                  options={provinces}
                  title="Tỉnh/Thành"
                  value={selectedProvince}
                  onChange={setSelectedProvince}
                />

                <Combobox
                  className="w-full h-13"
                  options={districtOptions}
                  title="Quận/Huyện"
                  value={selectedDistrict}
                  onChange={setSelectedDistrict}
                  disabled={!selectedProvince}
                />
              </div>
              <div className="space-x-2 flex">
                <Combobox
                  className="w-full h-13"
                  options={wardOptions}
                  title="Phường/Xã"
                  value={selectedWard}
                  onChange={setSelectedWard}
                  disabled={!selectedDistrict}
                />
                <div className="w-full">
                  <Input
                    className="h-13"
                    placeholder="Số nhà, tên đường"
                  ></Input>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="2"></TabsContent>
          </Tabs>
          <Button
            className="w-full h-13 mt-4 bg-blue-500 cursor-pointer hover:bg-blue-400 transition-all"
            type="submit"
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
