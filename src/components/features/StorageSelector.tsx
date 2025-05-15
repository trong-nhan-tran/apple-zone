// 📌 [client] components/ColorSelector.tsx (CSR Component)
"use client"; // Cần vì có event handler

import { useState } from "react";
import { Label } from "@/components/ui-shadcn/label";

export function StorageSelector() {
  const [selectedColor, setSelectedColor] = useState("128gb");

  return (
    <div className="flex flex-col gap-1">
      <p className="text-lg font-medium">
        Dung lượng - <span className="uppercase">{selectedColor}</span>
      </p>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <input
            type="radio"
            id="128gb"
            name="storage"
            value="128gb"
            className="peer hidden"
            checked={selectedColor === "128gb"}
            onChange={() => setSelectedColor("128gb")}
          />
          <Label
            htmlFor="128gb"
            className="bg-white w-full rounded-2xl p-3 border-2 flex justify-between cursor-pointer 
                       peer-checked:border-blue-400 hover:border-blue-400 transition-all"
          >
            <span className="font-bold text-lg">128GB</span>
            <div className="flex flex-col text-lg">
              <span className="">20.000.000đ</span>
              <span className="line-through text-gray-400">22.000.000đ</span>
            </div>
          </Label>
        </div>
        <div>
          <input
            type="radio"
            id="256gb"
            name="storage"
            value="256gb"
            className="peer hidden"
            checked={selectedColor === "256gb"}
            onChange={() => setSelectedColor("256gb")}
          />
          <Label
            htmlFor="256gb"
            className="bg-white w-full rounded-2xl p-3 border-2  flex justify-between cursor-pointer 
                       peer-checked:border-blue-400 hover:border-blue-400 transition-all"
          >
            <span className="font-bold text-lg">256GB</span>
            <div className="flex flex-col text-lg">
              <span className="">22.000.000đ</span>
              <span className=" line-through text-gray-400">24.000.000đ</span>
            </div>
          </Label>
        </div>
        <div>
          <input
            type="radio"
            id="512gb"
            name="storage"
            value="512gb"
            className="peer hidden"
            checked={selectedColor === "512gb"}
            onChange={() => setSelectedColor("512gb")}
          />
          <Label
            htmlFor="512gb"
            className="bg-white w-full rounded-2xl p-3 border-2 flex justify-between cursor-pointer 
                       peer-checked:border-blue-400 hover:border-blue-400 transition-all"
          >
            <span className="font-bold text-lg">512GB</span>
            <div className="flex flex-col text-lg">
              <span className="">26.000.000đ</span>
              <span className=" line-through text-gray-400">28.000.000đ</span>
            </div>
          </Label>
        </div>
      </div>
    </div>
  );
}
