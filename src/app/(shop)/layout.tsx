import Navbar from "@/components/layout/navbar";
// import { NavbarMobile } from "@/components/layout/navbar-mobile";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {/* <NavbarMobile></NavbarMobile> */}
      
      {children}
    </>
  );
}
