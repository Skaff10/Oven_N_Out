import Image from "next/image";
import { IoReorderTwoOutline } from "react-icons/io5";
const Navbar = () => {
  return (
    <nav className="fixed top-0 z-100 bg-accent w-full flex justify-between items-center pl-2 pr-5 py-4">
      <Image
        src="/logo/logo.svg"
        alt="Oven & Out"
        width={60}
        height={60}
        className="ml-5"
      />

      <ul className="hidden md:flex items-center gap-x-12">
        <li>Menu</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="md:hidden ">
        <IoReorderTwoOutline size={60} color="var(--color-primary)" />
      </div>
    </nav>
  );
};

export default Navbar;
