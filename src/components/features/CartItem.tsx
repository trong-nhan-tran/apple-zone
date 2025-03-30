import React from "react";
import Image from "next/image";
import SelectCustom from "../ui-custom/select-custom";

type Props = {
  cartItem?: any;
};

const CartItem = ({ cartItem }: Props) => {
  return (
    <div className="w-full bg-neutral-100 rounded-xl flex mb-5">
      <Image
        className="py-2"
        src={"/images/product/iphone-16-pro-max-titan-den-thumbnew-650x650.png"}
        width={100}
        height={50}
        alt=""
      />
      <div className="flex flex-col justify-between w-full py-4 mr-2">
        <div className="flex justify-between">
          <a className="block" href="">
            iPhone 16 Pro Max 512GB
          </a>
          <div className="flex flex-col">
            <span className="font-bold">37.590.000 đ</span>
            <span className="line-through">41.349.000 ₫</span>
          </div>
        </div>
        <div className="flex justify-between">
          <SelectCustom
            options={["Titan đen"]}
            defaultValue="Titan đen"
            placeholder="Chọn màu"
          />
          <SelectCustom
            options={["1", "2", "3"]}
            defaultValue="1"
            placeholder="Số lượng"
          />
        </div>
      </div>
      <button className=" text-gray-400 cursor-pointer hover:text-white hover:bg-neutral-300 p-4 rounded-r-xl">
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  );
};

export default CartItem;
