import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { SITE } from "@/lib/brands";

export default function BrandStory() {
  return (
    <section className="border-y border-ink/10 bg-[#F7F1E9]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={SITE.craftImage}
            alt="صناعة الاكسسوارات يدوياً"
            className="h-full w-full object-cover"
            fittingType="fill"
          />
        </div>

        <div>
          <p className="text-[11px] tracking-[0.32em] text-gold">حكايتنا</p>
          <h2 className="mt-3 font-heading text-4xl leading-[1.2] md:text-5xl">
            علامتان، وحكاية واحدة
            <br />
            من الحب والتفاصيل
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/60 md:text-base">
            بدأت «خرزة زرقة» من طاولة صغيرة وخيط وخرزات مختارة بعناية، ثم كبرت معها
            الحاجة إلى مكان يحمل الهدية كما نحملها: بورود وتغليف ورسالة. هكذا وُلد
            «MERSAL ALHOB» ليكون الامتداد الطبيعي — ذراعٌ تُنسّق وذراعٌ تصنع.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border-r border-gold/40 pr-4">
              <p className="font-heading text-xl text-royal">خرزة زرقة</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/55">
                أحجار طبيعية وتفاصيل مصنوعة باليد، لقطعة تشبه صاحبتها.
              </p>
            </div>
            <div className="border-r border-gold/40 pr-4">
              <p className="text-base font-medium tracking-[0.18em] text-[#9c5c5c]">
                MERSAL ALHOB
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/55">
                ورود وتغليف فاخر، لهدية تقول ما لا تقوله الكلمات.
              </p>
            </div>
          </div>

          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 border-b border-ink/25 pb-1 text-xs tracking-[0.18em] text-ink/70 transition-colors hover:border-gold hover:text-gold"
          >
            اقرأي المزيد عنّا
          </Link>
        </div>
      </div>
    </section>
  );
}