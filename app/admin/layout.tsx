import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Oven & Out — Admin",
  description: "Admin panel for Oven & Out cloud kitchen management",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
