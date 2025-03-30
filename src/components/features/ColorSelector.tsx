// 📌 [client] components/ColorSelector.tsx (CSR Component)
"use client"; // Cần vì có event handler

import { useState } from "react";
import { Label } from "@/components/ui/label";

export function ColorSelector() {
  const [selectedColor, setSelectedColor] = useState("white");

  return (
    <div className="flex flex-col gap-1">
      <p className="text-lg font-medium">
        Màu - <span className="capitalize">{selectedColor}</span>
      </p>

      <div className="flex gap-4">
        {/* Màu trắng */}
        <div>
          <input
            type="radio"
            id="white"
            name="color"
            value="white"
            className="peer hidden"
            checked={selectedColor === "white"}
            onChange={() => setSelectedColor("white")}
          />
          <Label
            htmlFor="white"
            className="bg-white w-12 h-12 rounded-full cursor-pointer 
                       peer-checked:border-blue-400 hover:border-blue-400 transition-all peer-checked:border-2"
          />
        </div>

        {/* Màu đen */}
        <div>
          <input
            type="radio"
            id="black"
            name="color"
            value="black"
            className="peer hidden"
            checked={selectedColor === "black"}
            onChange={() => setSelectedColor("black")}
          />
          <Label
            htmlFor="black"
            className="bg-black w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer 
                       peer-checked:border-blue-400 hover:border-blue-400 transition-all peer-checked:border-2"
          />
        </div>
      </div>
    </div>
  );
}
