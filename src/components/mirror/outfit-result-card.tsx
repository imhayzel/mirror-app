import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OutfitResultCardProps {
  imageUrl?: string;
  reasoning: string;
  outfitItems: string[];
  onGetRender?: () => void;
  hasIllustratedRender?: boolean;
  className?: string;
}

export function OutfitResultCard({
  imageUrl,
  reasoning,
  outfitItems,
  onGetRender,
  hasIllustratedRender = false,
  className,
}: OutfitResultCardProps) {
  return (
    <div
      className={cn(
        "bg-[#0A0A0A] text-white border border-[#0A0A0A] p-6",
        className
      )}
    >
      {imageUrl && (
        <div className="relative aspect-[4/3] w-full overflow-hidden mb-6">
          <Image src={imageUrl} alt="Outfit flat lay" fill className="object-cover" />
        </div>
      )}

      <div className="mb-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-2">
          TODAY&apos;S OUTFIT
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {outfitItems.map((item) => (
            <span
              key={item}
              className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-white/10 text-white px-[10px] py-1"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="font-sans text-[14px] leading-[22px] text-[#D4D4CF]">
          {reasoning}
        </p>
      </div>

      {!hasIllustratedRender && onGetRender && (
        <Button variant="accent" className="w-full mt-2" onClick={onGetRender}>
          GET ILLUSTRATED RENDER
        </Button>
      )}
    </div>
  );
}
