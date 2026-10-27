import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "كم مدة تجهيز الطلب؟",
    a: "الاكسسوارات تُصنع يدوياً وتحتاج من يوم إلى ثلاثة أيام عمل، والهدايا والورود تُجهّز في نفس اليوم عند الطلب قبل الظهر.",
  },
  {
    q: "هل يوجد توصيل؟",
    a: "نعم، نوصّل داخل المدينة في نفس اليوم أو اليوم التالي، وإلى باقي المدن خلال ٢–٤ أيام عمل، وتُحتسب أجرة التوصيل حسب المنطقة.",
  },
  {
    q: "هل يمكن تخصيص الهدية؟",
    a: "نعم، يمكنك تخصيص الصندوق والحجم والورود والتغليف والإضافات من صفحة المنتج خطوة بخطوة.",
  },
  {
    q: "هل يمكن اختيار الألوان؟",
    a: "نعم، تتوفر خيارات ألوان متعددة حسب نوع الورد والتغليف، وتُعرض أثناء خطوات التخصيص.",
  },
  {
    q: "هل يمكن كتابة بطاقة؟",
    a: "نعم، كل طلب هدايا يأتي ببطاقة إهداء مجانية، اكتبي النص في ملاحظات الطلب ونكتبه بخط اليد.",
  },
];

export default function Faq() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    base44.entities.StaticPage
      .filter({ title: "الأسئلة الشائعة" }, { limit: 1 })
      .then((page) => {
        const item = (page.items || [])[0];
        if (item?.content) {
          try {
            const parsed = JSON.parse(item.content);
            if (Array.isArray(parsed) && parsed.length) setFaqs(parsed);
          } catch {
            /* ignore malformed content */
          }
        }
      })
      .catch(() => {});
  }, []);

  const items = faqs.length ? faqs : FAQS;

  return (
    <div>
      <section className="border-b border-ink/10 bg-cream">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-24">
          <p className="reveal text-[11px] tracking-[0.4em] text-gold">الأسئلة الشائعة</p>
          <h1 className="reveal mt-4 font-heading text-4xl leading-tight md:text-6xl">
            كل ما تودّين معرفته
          </h1>
          <p className="reveal mt-5 text-sm leading-relaxed text-ink/55 md:text-base">
            جمعنا هنا أكثر ما يُسأل عن الطلبات، التوصيل، والتخصيص. وإن لم تجدي سؤالك،
            راسلينا مباشرة.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem
              key={item.q}
              value={`item-${index}`}
              className="border-b border-ink/12"
            >
              <AccordionTrigger className="py-5 text-right font-heading text-lg hover:no-underline md:text-xl">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-ink/60">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-14 flex flex-col items-center gap-4 border border-ink/12 px-6 py-10 text-center">
          <p className="font-heading text-2xl">سؤالك ليس هنا؟</p>
          <p className="max-w-sm text-sm text-ink/55">
            اكتبي لنا وسنجيبك في أقرب وقت، عادةً خلال ساعات قليلة.
          </p>
          <Link to="/contact">
            <Button className="mt-2 rounded-none bg-royal px-8 py-6 text-sm tracking-wide text-cream hover:bg-royal/90">
              تواصلي معنا
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}