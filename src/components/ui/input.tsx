import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[52px] w-full bg-white px-4 py-[16px]",
          "font-sans text-[16px] leading-[26px] text-[#0A0A0A]",
          "border border-[#0A0A0A] outline-none",
          "placeholder:text-[#5C5C5C]",
          "focus:border-2 focus:border-[#0A0A0A]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
