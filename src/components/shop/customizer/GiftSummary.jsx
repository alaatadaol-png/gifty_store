import React from "react";
import { formatPrice, formatMultiCurrency } from "@/lib/brands";

// ملخص ثابت يعرض الخيارات المحسوبة والسعر اللحظي
export default function GiftSummary({ box, size, flower, stems, wrapping, addons, totals }) {
  const rows = [
    ["الصندوق", box?.name, totals.boxPrice, box?.currency],
    ["الحجم", size?.name, totals.sizePrice, size?.currency],
    ["الورود", flower ? `${flower.name} × ${totals.flowerCount}` : null, totals.flowersPrice, flower?.currency],
    ["التغليف", wrapping?.name, totals.wrappingPrice, wrapping?.currency],
    ["الإضافات", addons.length ? addons.map((addon) => addon.name).join("، ") : " بدون", totals.addonsByCurrency, null],
  ];

  return (
    <div className="border border-ink/10 bg-white/70 p-4">
      <p className="text-[11px] tracking-[0.26em] text-gold">ملخص هديتك</p>

      <ul className="mt-4 space-y-3">
        {rows.map(([label, detail, value, currency]) => (
          <li key={label} className="flex items-start justify-between gap-3 text-xs">
            <div>
              <p className="text-ink/70">{label}</p>
              <p className="mt-0.5 text-ink/40">{detail || "—"}</p>
            </div>
            <span className="shrink-0 text-ink/60">
              {currency ? formatPrice(value, currency) : formatMultiCurrency(value)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4">
        <span className="text-sm text-ink/60">الإجمالي</span>
        <span className="font-heading text-2xl text-ink">{formatMultiCurrency(totals.totalsByCurrency)}</span>
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-ink/35">
        يُحدّث السعر تلقائياً مع كل تغيير في الخيارات.
      </p>
    </div>
  );
}