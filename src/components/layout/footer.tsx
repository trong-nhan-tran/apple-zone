"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Apple Zone</h3>
            <p className="text-gray-600 text-sm">
              Chuyên cung cấp các sản phẩm Apple chính hãng với giá tốt nhất thị
              trường.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-black">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-black">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-black">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-black"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-black">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-black">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category/iphone"
                  className="text-gray-600 hover:text-black"
                >
                  iPhone
                </Link>
              </li>
              <li>
                <Link
                  href="/category/ipad"
                  className="text-gray-600 hover:text-black"
                >
                  iPad
                </Link>
              </li>
              <li>
                <Link
                  href="/category/macbook"
                  className="text-gray-600 hover:text-black"
                >
                  MacBook
                </Link>
              </li>
              <li>
                <Link
                  href="/category/airpods"
                  className="text-gray-600 hover:text-black"
                >
                  AirPods
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-gray-600">
                <MapPin size={16} />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail size={16} />
                <span>contact@applezone.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Apple Zone. Tất cả quyền được bảo
              lưu.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-black"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-black"
              >
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
