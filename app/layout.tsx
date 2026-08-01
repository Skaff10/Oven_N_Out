import type { Metadata } from "next";
import { Bevan, Laila } from "next/font/google";
import "./globals.css";

import SiteShell from "@/components/SiteShell";

const bevan = Bevan({
  variable: "--font-bevan",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const laila = Laila({
  variable: "--font-laila",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oven & Out | Dhaka's Cloud Kitchen",
  description:
    "Oven & Out — fresh, fast, and made to order. A Dhaka-based cloud kitchen bringing bold flavors straight to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bevan.variable} ${laila.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
