import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WardrobeItemCardProps {
  id: string;
  name: string;
  type: string;
  imageUrl?: string;
  placeholderColor?: string;
  className?: string;
  onClick?: () => void;
}

export function WardrobeItemCard({
  name,
  type,
  imageUrl,
  placeholderColor = "#E8E8E3",
  className,
  onClick,
}: WardrobeItemCardProps) {
  return (
    <div
      className={cn(
        "group bg-white border border-[#0A0A0A] cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div
            className="w-full h-full group-hover:opacity-80 transition-opacity"
            style={{ backgroundColor: placeholderColor }}
          />
        )}
      </div>
      <div className="px-2 py-[5px] flex items-center justify-between border-t border-[#0A0A0A] min-h-[28px]">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] truncate mr-2 leading-[14px]">
          {name}
        </span>
        <Badge variant="tag" className="shrink-0 text-[9px] px-[6px] py-[2px]">
          {type}
        </Badge>
      </div>
    </div>
  );
}
