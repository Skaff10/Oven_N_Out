import Image from "next/image";

// components/Marquee.tsx
const MarqueeRow = ({
  marqueeText,
  bgColor,
  textColor,
  icon,
  direction,
}: {
  marqueeText: string;
  bgColor: string;
  textColor: string;
  icon: string;
  direction: "left" | "right";
}) => {
  return (
    <div
      className={`${bgColor}  overflow-hidden whitespace-nowrap  py-3 h-14 flex items-center`}
    >
      <div
        className={`inline-flex items-center leading-none ${
          direction === "left"
            ? "animate-marquee-left"
            : "animate-marquee-right"
        }`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className={`${textColor} font-heading text-2xl mx-4 flex items-center gap-2 leading-none`}
          >
            {marqueeText}{" "}
            <Image
              src={icon}
              alt=""
              width={26}
              height={26}
              className="inline-block"
            />
          </span>
        ))}
      </div>
    </div>
  );
};

const Marquee = ({
  marqueeText,
  bgColor1,
  bgColor2,
}: {
  marqueeText: string;
  bgColor1: string;
  bgColor2: string;
}) => {
  return (
    <div>
      <MarqueeRow
        marqueeText={marqueeText}
        bgColor={bgColor1}
        textColor={bgColor1 === "bg-accent" ? "text-primary" : "text-accent"}
        icon="/images/burgerIcon.png"
        direction="right"
      />
      <MarqueeRow
        marqueeText={marqueeText}
        bgColor={bgColor2}
        textColor={bgColor2 === "bg-primary" ? "text-accent" : "text-primary"}
        icon="/images/chickenleg.png"
        direction="left"
      />
    </div>
  );
};

export default Marquee;
