import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-sans text-[11px] font-semibold uppercase tracking-[0.1em] leading-[14px] px-[10px] py-1 border",
  {
    variants: {
      variant: {
        // Item type tags
        tag: "bg-[#E8E8E3] text-[#5C5C5C] border-transparent",
        // Free tier
        free: "bg-[#E8E8E3] text-[#0A0A0A] border-transparent",
        // Premium
        premium: "bg-[#0A0A0A] text-white border-transparent",
        // Default outline
        outline: "bg-transparent text-[#0A0A0A] border-[#0A0A0A]",
      },
    },
    defaultVariants: {
      variant: "tag",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
