import { cn } from "@/lib/utils";

interface StyleProfileCardProps {
  archetype: string;
  descriptors: string[];
  itemCount: number;
  className?: string;
}

export function StyleProfileCard({
  archetype,
  descriptors,
  itemCount,
  className,
}: StyleProfileCardProps) {
  return (
    <div
      className={cn(
        "bg-[#C8F000] text-[#0A0A0A] border border-[#0A0A0A] p-6",
        className
      )}
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A]/60 mb-2">
        YOUR STYLE ARCHETYPE
      </p>
      <h2 className="font-display text-[36px] font-semibold leading-[42px] tracking-[-0.01em] text-[#0A0A0A] mb-4">
        {archetype}
      </h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {descriptors.map((d) => (
          <span
            key={d}
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-[#0A0A0A]/10 text-[#0A0A0A] px-[10px] py-1"
          >
            {d}
          </span>
        ))}
      </div>
      <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0A0A0A]/60">
        {itemCount} ITEMS IN YOUR WARDROBE
      </p>
    </div>
  );
}
