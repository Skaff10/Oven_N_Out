import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaWhatsapp, FaPhone } from "react-icons/fa";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
];

const DELIVERY_AREAS = ["Mugda", "Manda", "Maniknagar", "Bashabo"];

const Footer = () => {
  return (
    <footer className="bg-primary text-accent px-5 pt-5 pb-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
        <div className="md:col-span-2">
          <Image
            src="/logo/logoText.png"
            alt="Oven & Out"
            width={250}
            height={80}
            className="-ml-6"
          />
          <p className="font-body text-sm text-accent/80 ">
            Fresh, fast, and fired up. Order from Dhaka&apos;s cloud kitchen
            built for your cravings.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <h2 className="text-xl font-heading text-secondary mb-4">NAVIGATE</h2>
          <ul className="font-body space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-accent/80 hover:text-secondary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery area */}
        <div>
          <h2 className="text-xl font-heading text-secondary mb-4">
            DELIVERY AREA
          </h2>
          <ul className="font-body space-y-2 text-accent/80">
            {DELIVERY_AREAS.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-heading text-secondary mb-4">CONTACT</h2>

          <div className="flex gap-3 mt-3">
            <a
              href="tel:+88016101505388"
              className="text-accent/80 hover:text-secondary transition-colors"
            >
              <FaPhone size={25} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-accent/80 hover:text-secondary transition-colors"
            >
              <FaFacebook size={25} />
            </a>
            <a
              href="#"
              aria-label="Whatsappp"
              className="text-accent/80 hover:text-secondary transition-colors"
            >
              <FaWhatsapp size={25} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-5 border-t border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs text-accent/60">
          © {new Date().getFullYear()} Oven & Out. All rights reserved.
        </p>
        <div className="flex gap-4"></div>
      </div>
    </footer>
  );
};

export default Footer;
