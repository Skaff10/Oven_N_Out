import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 font-body">
        {label && (
          <label className="text-sm font-semibold text-secondary/80">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-4 py-2.5 bg-secondary font-semibold text-text border border-dark-border rounded-lg placeholder-primary/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
