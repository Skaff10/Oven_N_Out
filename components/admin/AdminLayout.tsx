"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdminAction } from "@/lib/actions/adminActions";
import {
  FaChartBar,
  FaClipboardList,
  FaHome,
  FaPlusCircle,
  FaReceipt,
  FaSignOutAlt,
} from "react-icons/fa";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show full admin layout nav
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#F1E1CE] text-[#332218]">{children}</div>;
  }

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { label: "Home", href: "/admin", icon: FaHome },
    { label: "Orders", href: "/admin/orders", icon: FaClipboardList },
    { label: "+ Order", href: "/admin/orders/new", icon: FaPlusCircle, highlight: true },
    { label: "+ Expense", href: "/admin/expenses/new", icon: FaReceipt },
    { label: "Reports", href: "/admin/reports/daily", icon: FaChartBar },
  ];

  return (
    <div className="min-h-screen bg-[#F1E1CE] text-[#332218] font-body pb-24 ">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#81241D] text-[#F1E1CE] shadow-md px-4 py-3 border-b border-[#DEB124]/30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-heading text-lg tracking-wide text-[#DEB124]"
          >
            <span>OVEN & OUT</span>
            <span className="text-xs bg-[#DEB124] text-[#81241D] px-2 py-0.5 rounded-full font-sans font-black tracking-normal">
              ADMIN
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#332218]/40 hover:bg-[#332218] text-[#F1E1CE] text-xs font-bold rounded-xl border border-[#F1E1CE]/20 transition-all cursor-pointer"
          >
            <FaSignOutAlt size={12} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-8">{children}</main>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4CEB8] shadow-2xl px-2 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center relative -top-3"
                >
                  <div className="w-13 h-13 rounded-full bg-[#81241D] text-[#DEB124] shadow-lg border-2 border-white flex items-center justify-center active:scale-95 transition-transform">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-extrabold text-[#81241D] mt-0.5">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "text-[#81241D] font-extrabold bg-[#FAF2E8]"
                    : "text-[#332218]/70 hover:text-[#332218] font-semibold"
                }`}
              >
                <Icon size={18} />
                <span className="text-[11px] mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
