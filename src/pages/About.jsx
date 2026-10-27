import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { BRANDS, SITE } from "@/lib/brands";

const DEFAULT_INTRO =
  "نؤمن أن كل هدية تحمل رسالة، لذلك نصنع الهدايا والإكسسوارات بعناية واهتمام بالتفاصيل لنمنح عملاءنا تجربة مميزة لا تُنسى.";

const VALUES = [
  {
    title: "الحرفية قبل السرعة",
    text: "نصنع القطعة حين تُطلب، ونفضّل أن تتأخر قليلاً على أن تصل بلا روح.",
  },
  {
    title: "مواد مختارة بعناية",
    text: "أحجار طبيعية، خيوط متينة، وورود طازجة نختارها في صباح كل طلب.",
  },
  {
    title: "تفاصيل تُحسّ لا تُشرح",
    text: "من عقدة الخيط إلى شريط التغليف، كل تفصيل يُراجع باليد قبل الإرسال.",
  },
  {
    title: "علاقة لا تنتهي بالطلب",
    text: "نبقي تواصلنا معك بعد التسليم للصيانة، التعديل، أو تنسيق مناسب جديد.",
  },
];

export default function About() {
  const [intro, setIntro] = useState(DEFAULT_INTRO);

  useEffect(() => {
    base44.entities.StaticPage
      .filter({ title: "من نحن" }, { limit: 1 })
      .then((page) => {
        const item = (page.items || [])[0];
        if (item?.content) setIntro(item.content);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="border-b border-ink/10 bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-10 md:py-24">
          <p className="reveal text-[11px] tracking-[0.4em] text-gold">من نحن</p>
          <h1 className="reveal mx-auto mt-4 max-w-3xl font-heading text-4xl leading-[1.25] md:text-6xl">
            صناعة بيد، وإهداء بقلب
          </h1>
          <p className="reveal mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink/55 md:text-base">
            {intro}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={SITE.craftImage}
            alt="تفاصيل الصناعة اليدوية"
            className="h-full w-full object-cover"
            fittingType="fill"
          />
        </div>
        <div>
          <p className="text-[11px] tracking-[0.32em] text-gold">البداية</p>
          <h2 className="mt-3 font-heading text-3xl leading-snug md:text-4xl">
            من طاولة صغيرة إلى علامتين
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink/60 md:text-base">
            بدأت الحكاية بخرزات وخيط، وبهدية أردناها أن تكون مختلفة. مع الوقت صار
            التصنيع اليدوي جزءاً من يومنا، وصار من حولنا يطلبون الهدية لا القطعة فقط.
            فجمعنا الخبرتين: من يصنع بيده، ومن ينسّق بالورد والشريط.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink/60 md:text-base">
            اليوم نعمل على الطلبات الخاصة، وننسّق للمناسبات، ونبقي كل شيء صغيراً بما
            يكفي لنعرف اسم كل طلب ولمن سيذهب.
          </p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-[#F7F1E9]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-16 md:grid-cols-2 md:px-10 md:py-20">
          <div className="group overflow-hidden bg-cream">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={BRANDS.zarqa.heroImage}
                alt="خرزة زرقة"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                fittingType="fill"
              />
            </div>
            <div className="p-7">
              <p className="text-[10px] tracking-[0.3em] text-ink/40">HANDMADE ACCESSORIES</p>
              <h3 className="mt-2 font-heading text-3xl text-royal">خرزة زرقة</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{BRANDS.zarqa.intro}</p>
              <Link
                to="/accessories"
                className="mt-5 inline-block border-b border-royal/30 pb-1 text-xs tracking-[0.18em] text-royal transition-colors hover:border-royal"
              >
                استكشف الاكسسوارات
              </Link>
            </div>
          </div>

          <div className="group overflow-hidden bg-cream">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={BRANDS.mersal.heroImage}
                alt="MERSAL ALHOB"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                fittingType="fill"
              />
            </div>
            <div className="p-7">
              <p className="text-[10px] tracking-[0.3em] text-ink/40">FLOWERS &amp; GIFTS</p>
              <h3 className="mt-2 font-heading text-3xl text-[#9c5c5c]">MERSAL ALHOB</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{BRANDS.mersal.intro}</p>
              <Link
                to="/gifts"
                className="mt-5 inline-block border-b border-[#9c5c5c]/30 pb-1 text-xs tracking-[0.18em] text-[#9c5c5c] transition-colors hover:border-[#9c5c5c]"
              >
                استكشف الهدايا
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <p className="text-[11px] tracking-[0.32em] text-gold">ما نؤمن به</p>
        <h2 className="mt-3 font-heading text-3xl md:text-4xl">أربع قواعد لا نتنازل عنها</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, index) => (
            <div key={value.title} className="border-t border-ink/15 pt-5">
              <span className="font-heading text-2xl text-gold/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-heading text-xl">{value.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-8 md:px-10">
        <div className="flex flex-col items-center gap-5 border-y border-ink/10 py-14 text-center">
          <h2 className="max-w-xl font-heading text-3xl leading-snug md:text-4xl">
            عندك مناسبة؟ خلّينا نجهّزها معك
          </h2>
          <Link to="/contact">
            <Button className="rounded-none bg-ink px-8 py-6 text-sm tracking-wide text-cream hover:bg-ink/90">
              تواصلي معنا
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}