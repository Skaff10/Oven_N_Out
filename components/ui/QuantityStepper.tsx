import { FaMinus, FaPlus } from "react-icons/fa";

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  className?: string;
  size?: "sm" | "md";
}

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 0,
  className = "",
  size = "md",
}: QuantityStepperProps) {
  const isSm = size === "sm";

  return (
    <div
      className={`inline-flex items-center bg-secondary border border-dark-border rounded-lg overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`flex items-center justify-center text-primary hover:bg-primary transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer ${
          isSm ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
        }`}
        aria-label="Decrease quantity"
      >
        <FaMinus />
      </button>

      <span
        className={`font-heading text-center text-text min-w-10 select-none ${
          isSm ? "text-sm" : "text-base"
        }`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className={`flex items-center justify-center text-primary hover:bg-primary transition-colors cursor-pointer ${
          isSm ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
        }`}
        aria-label="Increase quantity"
      >
        <FaPlus />
      </button>
    </div>
  );
}
