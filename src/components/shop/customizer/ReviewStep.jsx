import React from "react";
import { formatPrice, formatMultiCurrency } from "@/lib/brands";

export default function ReviewStep({ product, box, size, flower, stems, wrapping, addons, totals }) {
  const rows = [
    ["سعر الصندوق", box.name, totals.boxPrice, box?.currency],
    ["سعر الحجم", size.name, totals.sizePrice, size?.currency],
    ["الورود", `${flower.name} × ${totals.flowerCount}`, totals.flowersPrice, flower?.currency],
    ["التغليف", wrapping.name, totals.wrappingPrice, wrapping?.currency],
    ["الإضافات", addons.length ? addons.map((addon) => addon.name).join("، ") : "بدون", totals.addonsByCurrency, null],
  ];

  return (
    <div>
      <h3 className="font-heading text-2xl">المعاينة النهائية</h3>
      <p className="mt-1 text-sm text-ink/50">
        راجعي تفاصيل هديتك قبل إضافتها للسلة.
      </p>

      <div className="mt-6 border border-ink/10 bg-white/60">
        <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 px-4 py-3">
          <span className="font-heading text-lg">{product.name}</span>
          <span className="text-[11px] tracking-[0.2em] text-gold">هدية مخصصة</span>
        </div>

        <ul className="divide-y divide-ink/5">
          {rows.map(([label, detail, value, currency]) => (
            <li key={label} className="flex items-start justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm text-ink">{label}</p>
                <p className="mt-0.5 text-[11px] text-ink/45">{detail}</p>
              </div>
              <span className="shrink-0 text-sm text-ink/70">
                {currency ? formatPrice(value, currency) : formatMultiCurrency(value)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border border-ink/10 bg-cream px-4 py-4">
        <p className="text-[11px] tracking-[0.22em] text-gold">طريقة الحساب</p>
        <p className="mt-2 text-xs leading-relaxed text-ink/55">
          الصندوق + الحجم + (عدد الورود × سعر الوردة) + التغليف + الإضافات
        </p>
        <div className="mt-3 flex items-baseline justify-between border-t border-ink/10 pt-3">
          <span className="text-sm text-ink/60">السعر الإجمالي</span>
          <span className="font-heading text-2xl">{formatMultiCurrency(totals.totalsByCurrency)}</span>
        </div>
      </div>
    </div>
  );
}