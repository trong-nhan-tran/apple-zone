import ShopBanner from "@/components/features/ShopBanner";
import NavType from "@/components/features/NavType";

export default function ShopCategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full md:max-w-4/5 md:mx-auto">
      <ShopBanner />
      <NavType />

      {children}
    </div>
  );
}
