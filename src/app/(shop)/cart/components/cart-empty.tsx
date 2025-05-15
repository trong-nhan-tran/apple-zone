import { Button } from "@/components/ui-shadcn/button";
import React from "react";
import { useRouter } from "next/navigation";
type Props = {};

const CartEmpty = (props: Props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center w-full md:max-w-1/2 m-auto mt-5 rounded-2xl bg-white p-8 text-center">
      <h2 className="font-bold mb-4 text-2xl">Giỏ hàng của bạn đang trống</h2>
      <p className="mb-8 text-gray-600">
        Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
      </p>
      <Button
        className="bg-blue-500 hover:bg-blue-400 transition-all"
        onClick={() => router.push("/")}
      >
        Tiếp tục mua sắm
      </Button>
    </div>
  );
};

export default CartEmpty;
