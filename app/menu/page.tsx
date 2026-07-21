"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";

export default function MenuSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <section className="bg-secondary mt-24">
        <h2 className="text-center text-3xl font-heading pb-3 pt-5 text-primary">
          OUR MENU
        </h2>

        <div className="flex justify-center mb-5">
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            aria-label="Open full menu"
          >
            <Image
              src="/images/menu.png"
              alt="Restaurant menu"
              width={400}
              height={300}
            />
          </button>
        </div>

        <div className="flex items-center justify-center pb-5">
          <Link
            href="/order"
            className="font-heading text-xl bg-primary rounded-lg px-5 py-3 text-secondary shadow-2xl"
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

      <section className="bg-accent grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12">
        <div className="bg-accent rounded-2xl overflow-hidden">
          <div className="rounded-xl overflow-hidden">
            <Image
              src="/images/chickenfry.png"
              alt="Chicken Fry"
              width={400}
              height={300}
              className="w-full h-64 object-cover"
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
          <div className="rounded-xl overflow-hidden">
            <Image
              src="/images/pasta3.png"
              alt="Chicken Fry"
              width={400}
              height={300}
              className="w-full h-64 object-cover"
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
          <div className="rounded-xl overflow-hidden">
            <Image
              src="/images/wings2.png"
              alt="Chicken Fry"
              width={400}
              height={300}
              className="w-full h-64 object-cover"
            />
          </div>
          <h2 className="text-text text-2xl font-black uppercase mt-4">
            Classic Wings
          </h2>
          <p className="text-text mt-2 leading-relaxed">
            Don't forget the classic wings! We recommend trying them with our
            perfect sweet chilli sauce
          </p>
        </div>
      </section>
      <section className="flex justify-center items-center h-25 bg-accent">
        <Link
          href="/order"
          className="font-heading text-xl bg-primary rounded-lg px-5 py-3 text-secondary shadow-xl cursor-pointer"
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
            className="absolute top-5 right-5 text-secondary text-4xl leading-none cursor-pointer"
            aria-label="Close menu"
          >
            &times;
          </button>
          <div
            className="relative max-w-3xl w-full max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/images/menu.png"
              alt="Restaurant menu"
              width={1200}
              height={1600}
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
