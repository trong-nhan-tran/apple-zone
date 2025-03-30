"use client";;
import NavLink from "./navlink";

type Props = {}

const NavMainAdmin = (props: Props) => {
  return (
    <nav className="text-sm flex gap-6">
        <NavLink href="/admin/overview" name="Tổng quan" />
        <NavLink href="/admin/order" name="Đơn hàng" />
        <NavLink href="/admin/category" name="Danh mục" />
        <NavLink href="/admin/product" name="Dòng sản phẩm" />
        <NavLink href="/admin/product-item" name="Sản phẩm" />
        <NavLink href="/admin/color" name="Màu sắc" />
        <NavLink href="/admin/banner" name="Banner" />
        <NavLink href="/admin/user" name="Tài khoản" />
    </nav>
  )
}

export default NavMainAdmin