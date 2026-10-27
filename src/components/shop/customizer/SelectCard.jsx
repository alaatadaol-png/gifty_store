import React from "react";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/brands";
import { cn } from "@/lib/utils";

// بطاقة اختيار مع صورة (الصناديق)
export default function SelectCard({ selected, onClick, disabled, title, subtitle, price, currency, image }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col overflow-hidden border text-right transition-all duration-300",
        selected
          ? "border-ink bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)]"
          : "border-ink/15 bg-white/60 hover:border-ink/40",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-ink/5">
        {image ? (
          // تم تصحيح الخطأ الإملائي هنا (كان <Img[] وأصبح <img)
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3">
            <span className="text-center font-heading text-lg text-ink/30">{title}</span>
          </div>
        )}
        {selected && (
          <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-cream">
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="w-full px-3 py-3">
        <p className="font-heading text-base text-ink">{title}</p>
        {subtitle && <p className="mt-0.5 text-[11px] text-ink/45">{subtitle}</p>}
        {price !== undefined && (
          <p className="mt-1 text-xs text-ink/65">{formatPrice(price, currency)}</p>
        )}
      </div>
    </button>
  );
}