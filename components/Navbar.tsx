"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { IoReorderTwoOutline } from "react-icons/io5";
import { FaShoppingBag, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-accent w-full flex justify-between items-center pl-2 pr-5 py-4 shadow-md font-heading text-text">
      {/* Brand Logo */}
      <Link href="/" className="cursor-pointer flex items-center" onClick={closeMobileMenu}>
        <Image
          src="/logo/logo.svg"
          alt="Oven & Out"
          width={50}
          height={50}
          className="ml-5"
        />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-x-10">
        <ul className="flex items-center gap-x-8 text-base">
          <li>
            <Link href="/menu" className="hover:text-primary transition-colors">
              MENU
            </Link>
          </li>
          <li>
            <Link href="/order" className="hover:text-primary transition-colors">
              ORDER NOW
            </Link>
          </li>
          <li>
            <a href="tel:+88016101505388" className="hover:text-primary transition-colors">
              CONTACT
            </a>
          </li>
        </ul>

        {/* Cart Button */}
        <button
          onClick={openCart}
          className="relative bg-primary hover:bg-primary/95 text-secondary flex items-center justify-center p-3 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          aria-label="Open cart"
        >
          <FaShoppingBag size={16} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-text font-heading text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-primary">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Actions */}
      <div className="flex md:hidden items-center gap-3">
        {/* Cart icon for mobile */}
        <button
          onClick={openCart}
          className="relative bg-primary hover:bg-primary/95 text-secondary flex items-center justify-center p-3 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          aria-label="Open cart"
        >
          <FaShoppingBag size={14} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-text font-heading text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-primary">
              {totalItems}
            </span>
          )}
        </button>

        {/* Hamburger Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <IoReorderTwoOutline size={48} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-120 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={closeMobileMenu}
          />

          {/* Menu Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-accent shadow-2xl flex flex-col p-6 animate-slide-in-right">
            <div className="flex justify-end mb-8">
              <button
                onClick={closeMobileMenu}
                className="p-1 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <ul className="flex flex-col gap-6 text-xl">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary block py-2 border-b border-primary/10"
                  onClick={closeMobileMenu}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-primary block py-2 border-b border-primary/10"
                  onClick={closeMobileMenu}
                >
                  MENU
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="hover:text-primary block py-2 border-b border-primary/10"
                  onClick={closeMobileMenu}
                >
                  ORDER ONLINE
                </Link>
              </li>
              <li>
                <a
                  href="tel:+88016101505388"
                  className="hover:text-primary block py-2"
                  onClick={closeMobileMenu}
                >
                  CONTACT
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
