"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui-shadcn/input";
import { Button } from "@/components/ui-shadcn/button";

interface VoucherInputProps {
  onApply: (code: string) => void;
}

const VoucherInput = ({ onApply }: VoucherInputProps) => {
  const [voucherCode, setVoucherCode] = useState("");

  const handleApplyVoucher = () => {
    onApply(voucherCode);
  };

  return (
    <div className="flex w-full items-center space-x-2 mb-6">
      <Input
        className="h-12"
        type="text"
        placeholder="Nhập mã giảm giá"
        value={voucherCode}
        onChange={(e) => setVoucherCode(e.target.value)}
      />
      <Button
        className="h-12 bg-blue-500 cursor-pointer hover:bg-blue-400 transition-all"
        onClick={handleApplyVoucher}
      >
        Áp dụng voucher
      </Button>
    </div>
  );
};

export default VoucherInput;