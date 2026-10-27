import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import ChoiceRow from "@/components/shop/customizer/ChoiceRow";
import { formatPrice } from "@/lib/brands";

export default function FlowerStep({
  flowers,
  flowerId,
  onFlowerChange,
  stems,
  onStemsChange,
  size,
  min,
  max,
}) {
  const [limitHit, setLimitHit] = useState(false);

  const applyCount = (next) => {
    if (next === "" || Number.isNaN(next)) {
      setLimitHit(false);
      onStemsChange("");
      return;
    }
    if (max && next > max) {
      setLimitHit(true);
      onStemsChange(max);
      return;
    }
    setLimitHit(false);
    onStemsChange(Math.max(0, next));
  };

  return (
    <div>
      <h3 className="font-heading text-2xl">اختاري الورود</h3>
      <p className="mt-1 text-sm text-ink/50">
        نوع الوردة وعددها — الحد الأقصى يتبع الحجم المختار.
      </p>

      <div className="mt-5 space-y-2.5">
        {flowers.map((flower) => (
          <ChoiceRow
            key={flower.id}
            selected={flowerId === flower.id}
            onClick={() => onFlowerChange(flower.id)}
            title={flower.name}
            hint="للوردة الواحدة"
            price={flower.price_per_stem}
            currency={flower.currency}
          />
        ))}
      </div>

      <div className="mt-7 border border-ink/15 bg-white/60 p-4">
        <p className="text-[11px] tracking-[0.24em] text-gold">عدد الورود</p>

        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            aria-label="تقليل"
            onClick={() => applyCount(Math.max(min, Number(stems || 0) - 1))}
            className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink/60 transition-colors hover:border-ink/45 hover:text-ink"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <Input
            type="number"
            inputMode="numeric"
            min={min}
            max={max || undefined}
            value={stems}
            onChange={(event) => applyCount(event.target.value)}
            onBlur={() => {
              if (!stems || Number(stems) < min) onStemsChange(min);
            }}
            className="h-11 w-20 rounded-none border-ink/20 bg-white text-center"
          />

          <button
            type="button"
            aria-label="زيادة"
            onClick={() => applyCount(Math.min(max || 99, Number(stems || 0) + 1))}
            className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink/60 transition-colors hover:border-ink/45 hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          <p className="text-xs text-ink/50">
            {size ? `الحجم ${size.name}: من ${min} إلى ${max} وردة` : "اختاري الحجم أولاً"}
          </p>
        </div>

        {limitHit && (
          <p className="mt-3 text-xs text-[#9c5c5c]">
            الحد الأقصى لهذا الحجم {max} وردة — تم ضبط العدد تلقائياً.
          </p>
        )}

        <p className="mt-3 text-xs text-ink/45">
          سعر الورود: {Number(stems || 0)} × الوردة ={" "}
          <span className="text-ink/70">
            {formatPrice(
              Number(stems || 0) *
                Number(flowers.find((f) => f.id === flowerId)?.price_per_stem || 0),
              flowers.find((f) => f.id === flowerId)?.currency
            )}
          </span>
        </p>
      </div>
    </div>
  );
}