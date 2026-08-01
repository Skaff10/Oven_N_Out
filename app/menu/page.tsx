"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";

export default function MenuSection() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div>
      <section className="bg-secondary mt-22 py-6">
        <h2 className="text-center text-3xl md:text-4xl font-heading pb-4 pt-2 text-primary">
          OUR MENU
        </h2>

        <div className="flex justify-center mb-6 px-4">
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer transition-transform hover:scale-[1.02] w-full max-w-[400px] md:max-w-[620px] lg:max-w-[700px] flex justify-center"
            aria-label="Open full menu"
          >
            <div className="relative w-full aspect-[2/3] max-w-[400px] md:max-w-[620px] lg:max-w-[700px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/menu2.png"
                alt="Restaurant menu"
                fill
                className="object-contain rounded-2xl"
                sizes="(max-width: 768px) 400px, 700px"
              />
            </div>
          </button>
        </div>

        <div className="flex items-center justify-center pb-5">
          <Link
            href="/order"
            className="font-heading text-xl bg-primary rounded-lg px-6 py-3.5 text-secondary shadow-2xl hover:bg-red-900 transition-colors"
          >
            ORDER ONLINE
          </Link>
        </div>
      </section>
      <Marquee
        marqueeText="WE DELIVER HOT, FRESH & FAST"
        bgColor1="bg-accent"
        bgColor2="bg-primary"
      />

      <section className="bg-accent py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-accent rounded-2xl overflow-hidden">
              <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden bg-[#81241d] shadow-md">
                <Image
                  src="/images/chickenfry.png"
                  alt="Chicken Fry"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h2 className="text-text text-2xl font-black uppercase mt-4">
                Crispy Chicken Fry
              </h2>
              <p className="text-text mt-2 leading-relaxed">
                Crispy fried chicken legs, feels right when served with our special
                honey sauce and our fries!
              </p>
            </div>
            <div className="bg-accent rounded-2xl overflow-hidden">
              <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden bg-[#81241d] shadow-md">
                <Image
                  src="/images/pasta3.png"
                  alt="Classic Pasta"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h2 className="text-text text-2xl font-black uppercase mt-4">
                Classic Pasta
              </h2>
              <p className="text-text mt-2 leading-relaxed">
                Classic pasta with a rich and creamy tomato sauce, you can add the
                cheese anytime!
              </p>
            </div>
            <div className="bg-accent rounded-2xl overflow-hidden">
              <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden bg-[#81241d] shadow-md">
                <Image
                  src="/images/wings2.png"
                  alt="Classic Wings"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h2 className="text-text text-2xl font-black uppercase mt-4">
                Classic Wings
              </h2>
              <p className="text-text mt-2 leading-relaxed">
                Don&apos;t forget the classic wings! We recommend trying them with our
                perfect sweet chilli sauce
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex justify-center items-center py-8 bg-accent">
        <Link
          href="/order"
          className="font-heading text-xl bg-primary rounded-lg px-6 py-3.5 text-secondary shadow-xl cursor-pointer hover:bg-red-900 transition-colors"
        >
          ORDER ONLINE
        </Link>
      </section>
      <Marquee
        marqueeText="WE DELIVER HOT, FRESH & FAST"
        bgColor1="bg-primary"
        bgColor2="bg-accent"
      />
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-secondary text-4xl leading-none cursor-pointer hover:text-accent transition-colors"
            aria-label="Close menu"
          >
            &times;
          </button>
          <div
            className="relative max-w-3xl w-full max-h-[85vh] flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/images/menu.png"
              alt="Restaurant menu"
              width={1200}
              height={1600}
              className="w-full h-auto max-h-[85vh] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

