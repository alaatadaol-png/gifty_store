import React from "react";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/brands";
import { cn } from "@/lib/utils";

// صف اختيار بسيط (الحجم، الورود، التغليف، الإضافات)
export default function ChoiceRow({
  selected,
  onClick,
  disabled,
  title,
  hint,
  price,
  currency,
  multi = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between gap-3 border px-4 py-3 text-right transition-all duration-300",
        selected
          ? "border-ink bg-white shadow-sm"
          : "border-ink/15 bg-white/50 hover:border-ink/40",
        disabled && "cursor-not-allowed opacity-40 hover:border-ink/15"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
          multi ? "rounded-[2px]" : "rounded-full",
          selected ? "border-ink bg-ink text-cream" : "border-ink/30"
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
      <span className="flex-1">
        <span className="block text-sm text-ink">{title}</span>
        {hint && <span className="mt-0.5 block text-[11px] text-ink/45">{hint}</span>}
      </span>
      {price !== undefined && (
        <span className="shrink-0 text-xs text-ink/60">{formatPrice(price, currency)}</span>
      )}
    </button>
  );
}