import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "@/lib/brands";
import { Button } from "@/components/ui/button";

export default function BrandStory() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={SITE.craftImage}
            alt="قصة العلامة"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-[11px] tracking-[0.32em] text-gold">قصتنا</p>
          <h2 className="mt-3 font-heading text-3xl leading-snug md:text-4xl">
            نصنع التفاصيل التي تحكي عنك
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink/60 md:text-base">
            في خرزة زرقة ومرسال الحب، نؤمن أن كل قطعة نصنعها هي امتداد لشخصيتك. من اختيار الحجر إلى ربط الشريط الأخير، كل خطوة تُنجز بحب وعناية لتحمل رسالتك إلى من تحب.
          </p>
          <Link to="/about">
            <Button variant="outline" className="mt-7 rounded-none border-ink/20">
              اقرأ المزيد عنا
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}