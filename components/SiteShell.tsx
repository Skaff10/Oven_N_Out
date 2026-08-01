"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/order/CartDrawer";
import { CartProvider } from "@/context/CartContext";

/**
 * Wraps children with the customer-facing Navbar, Footer, and CartProvider
 * UNLESS the current route is under /admin.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin pages have their own AdminLayout; skip customer chrome
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
