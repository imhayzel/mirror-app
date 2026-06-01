import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-sans text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        // Black fill → accent on hover
        primary:
          "bg-[#0A0A0A] text-white border border-[#0A0A0A] hover:bg-[#C8F000] hover:text-[#0A0A0A] hover:border-[#C8F000]",
        // Transparent outline
        secondary:
          "bg-transparent text-[#0A0A0A] border border-[#0A0A0A] hover:bg-[#E8E8E3]",
        // Accent fill — one per screen
        accent:
          "bg-[#C8F000] text-[#0A0A0A] border border-[#C8F000] hover:bg-[#b8e000]",
        ghost:
          "bg-transparent text-[#0A0A0A] hover:bg-[#E8E8E3] border border-transparent",
        destructive:
          "bg-[#D4000F] text-white border border-[#D4000F] hover:bg-[#b8000d]",
      },
      size: {
        default: "h-[52px] px-8",
        sm: "h-9 px-4",
        lg: "h-[60px] px-10",
        icon: "h-[52px] w-[52px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
