import React, { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useActivePromotions, latestActivePromotion } from "@/lib/promotions";

// شريط إعلاني في أعلى الصفحة الرئيسية يظهر أحدث عرض نشط
export default function PromoBanner() {
  const promotions = useActivePromotions();
  const promo = latestActivePromotion(promotions);
  const [dismissed, setDismissed] = useState(false);

  if (!promo || dismissed) return null;

  return (
    <div className="bg-ink text-cream">
      <div className="relative mx-auto flex max-w-[1400px] items-center justify-center gap-3 px-5 py-2.5 text-center text-xs md:text-sm">
        <Megaphone className="hidden h-4 w-4 shrink-0 text-gold sm:block" strokeWidth={1.5} />
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span className="font-heading text-gold">{promo.title}</span>
          {promo.discount_percentage > 0 && (
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] tracking-wide text-gold">
              خصم {promo.discount_percentage}%
            </span>
          )}
          {promo.description && (
            <span className="text-cream/70">— {promo.description}</span>
          )}
          <Link
            to="/gifts"
            className="border-b border-cream/40 pb-0.5 tracking-wide text-cream hover:border-cream"
          >
            تسوّقي الآن
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="إغلاق"
          className="absolute left-3 text-cream/60 transition-colors hover:text-cream md:left-5"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}