import Marquee from "@/components/Marquee";
import Image from "next/image";
import Link from "next/link";

const Homepage = () => {
  return (
    <div className="w-full  min-h-screen flex flex-col">
      <main className="relative h-[65vh] w-full flex flex-col">
        <Image
          src="/images/heropic2.png"
          alt="oven n out"
          fill
          className="object-cover"
          priority
          loading="eager"
        />

        {/* CHANGED: justify-between instead of justify-end, wraps all 3 blocks */}
        <div className="relative  z-50 flex flex-col items-start justify-between h-full px-6 py-10 md:px-12 md:py-16">
          {/* MIDDLE — pushed to center via flex-1 + centering */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-left text-5xl md:text-6xl leading-[0.95] text-secondary [text-shadow:3px_3px_0_#8b3a1a,6px_6px_0_#5c2510] font-heading ">
              IN TASTE
              <br />
              WE TRUST
            </h1>
          </div>
          <Link
            href="/order"
            className="z-10   px-8 py-3.5 bg-accent shadow-2xl rounded-lg text-xl cursor-pointer font-heading text-center text-text"
          >
            ORDER ONLINE
          </Link>
        </div>
      </main>
      <Marquee marqueeText={`Call us at 016101505388 For Delivery`} bgColor1="bg-accent" bgColor2="bg-primary"/>
      <section className="bg-secondary">
        <h2 className="font-heading text-4xl text-left md:text-center text-primary  px-6 pt-10">
          Crowd Favorites
        </h2>
        <p className="font-body text-left md:text-center  text-text text-xl pt-2 px-6">
          Hot, fast, and straight to your door.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-5 pt-6 pb-6 md:px-12">
          {[
            { src: "/images/meatbox.png", alt: "Chef's pick 1" },
            { src: "/images/wings.png", alt: "Chef's pick 2" },
            { src: "/images/pasta2.png", alt: "Chef's pick 3" },
            { src: "/images/strips.png", alt: "Chef's pick 4" },
          ].map((item) => (
            <div
              key={item.src}
              className="relative aspect-square w-full overflow-hidden rounded-lg"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mb-5 cursor-pointer">
          <Link
            href="/order"
            className="font-heading text-xl bg-primary rounded-lg px-5 py-3 text-secondary shadow-2xl"
          >
            VIEW OUR MENU
          </Link>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mb-6 relative h-[70dvh] min-h-[480px] w-[92%] rounded-2xl overflow-hidden mx-auto flex flex-col justify-start pt-10">
          <Image
            src="/images/storyImage.png"
            alt="Oven & Out crispy chicken fry"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 92vw, 800px"
          />

          <div className="relative z-10 flex flex-col px-6 pb-10 md:pb-14 md:items-center">
            <h4 className="font-heading text-lg text-left md:text-center text-secondary pb-1 pl-2">
              Tasty & Crispy
            </h4>
            <h2 className="font-heading text-4xl text-left md:text-center text-accent pb-2">
              Chicken Fry
            </h2>
            <p className="font-body text-sm pt-2 text-secondary">
              Oven & Out brings you the crunchiest, juiciest, and most flavorful
              fried chicken you'll ever taste. Made with secret spices and fried
              to perfection, every bite is a burst of flavor that will keep you
              coming back for more. Perfect for sharing or enjoying all by
              yourself.
            </p>

            <div className="flex items-start justify-start md:justify-center mt-5 cursor-pointer">
              <Link
                href="/menu"
                className="font-heading text-sm bg-accent rounded-lg px-5 py-3 text-text shadow-2xl"
              >
                ORDER ONLINE
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Marquee marqueeText="WE DELIVER HOT, FRESH & FAST" bgColor1="bg-primary" bgColor2="bg-accent" />
    </div>
  );
};

export default Homepage;
