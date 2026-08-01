import Marquee from "@/components/Marquee";
import Image from "next/image";
import Link from "next/link";

const Homepage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <main className="relative h-[65vh] md:h-[91vh] w-full flex flex-col overflow-hidden">
        {/* Mobile hero image */}
        <Image
          src="/images/heropic2.png"
          alt="oven n out"
          fill
          className="object-cover object-center block md:hidden"
          priority
          loading="eager"
        />
        {/* Desktop hero image */}
        <Image
          src="/images/heropic3.png"
          alt="oven n out"
          fill
          className="hidden md:block"
          priority
          loading="eager"
        />

        <div className="relative z-50 flex flex-col items-start justify-between h-full px-6 py-10 md:px-12 md:py-16 max-w-7xl mx-auto w-full">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-left text-5xl md:text-6xl lg:text-9xl leading-[0.95] text-secondary [text-shadow:3px_3px_0_#8b3a1a,6px_6px_0_#5c2510] font-heading ">
              IN TASTE
              <br />
              WE TRUST
            </h1>
          </div>
          <Link
            href="/order"
            className="z-10 px-8 py-3.5 bg-accent shadow-2xl rounded-lg text-xl md:text-4xl cursor-pointer font-heading text-center text-text hover:bg-amber-400 transition-colors"
          >
            ORDER ONLINE
          </Link>
        </div>
      </main>
      <Marquee marqueeText={`Call us at 016101505388 For Delivery`} bgColor1="bg-accent" bgColor2="bg-primary"/>
      <section className="bg-secondary py-4">
        <h2 className="font-heading text-4xl text-left md:text-center text-primary px-6 pt-6">
          Crowd Favorites
        </h2>
        <p className="font-body text-left md:text-center text-text text-xl pt-2 px-6">
          Hot, fast, and straight to your door.
        </p>
        <div className="max-w-7xl mx-auto px-5 pt-6 pb-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { src: "/images/meatbox.png", alt: "Chef's pick 1" },
              { src: "/images/wings.png", alt: "Chef's pick 2" },
              { src: "/images/pasta2.png", alt: "Chef's pick 3" },
              { src: "/images/strips.png", alt: "Chef's pick 4" },
            ].map((item) => (
              <div
                key={item.src}
                className="relative aspect-square w-full overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center mb-6 cursor-pointer">
          <Link
            href="/menu"
            className="font-heading text-xl bg-primary rounded-lg px-6 py-3.5 text-secondary shadow-2xl hover:bg-red-900 transition-colors"
          >
            VIEW OUR MENU
          </Link>
        </div>
      </section>

      <section className="bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-primary grid grid-cols-1 md:grid-cols-2 min-h-[440px] md:min-h-[480px] shadow-2xl">
            {/* Background image on mobile, right side image on desktop */}
            <div className="absolute inset-0 md:relative md:inset-auto md:order-2 md:h-full w-full">
              <Image
                src="/images/storyImage.png"
                alt="Oven & Out crispy chicken fry"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 92vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/40 md:hidden" />
            </div>

            {/* Text content on left side for desktop */}
            <div className="relative z-10 flex flex-col justify-center p-6 md:p-12 md:order-1 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-none">
              <h4 className="font-heading text-lg text-left text-secondary pb-1">
                Tasty & Crispy
              </h4>
              <h2 className="font-heading text-4xl md:text-5xl text-left text-accent pb-3">
                Chicken Fry
              </h2>
              <p className="font-body text-base text-secondary/90 leading-relaxed max-w-lg">
                Oven & Out brings you the crunchiest, juiciest, and most flavorful
                fried chicken you&apos;ll ever taste. Made with secret spices and fried
                to perfection, every bite is a burst of flavor that will keep you
                coming back for more. Perfect for sharing or enjoying all by
                yourself.
              </p>

              <div className="flex items-start justify-start mt-6">
                <Link
                  href="/menu"
                  className="font-heading text-base bg-accent rounded-lg px-6 py-3 text-text shadow-xl hover:bg-amber-400 transition-colors"
                >
                  ORDER ONLINE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Marquee marqueeText="WE DELIVER HOT, FRESH & FAST" bgColor1="bg-primary" bgColor2="bg-accent" />
    </div>
  );
};

export default Homepage;

