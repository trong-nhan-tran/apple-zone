import React from "react";

export default function ShopCategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full md:max-w-4/5 md:mx-auto">{children}</div>;
}
