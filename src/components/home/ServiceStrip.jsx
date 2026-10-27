import React from "react";
import { Gift, Sparkles, Truck } from "lucide-react";

const ITEMS = [
  {
    icon: Sparkles,
    title: "صناعة يدوية",
    text: "كل خرزة وكل عقدة تُعمل باليد في مشغلنا، فلا تتطابق قطعتان تماماً.",
  },
  {
    icon: Gift,
    title: "تغليف هدية",
    text: "تغليف فاخر مع بطاقة إهداء مجاناً لكل طلب من المتجرين.",
  },
  {
    icon: Truck,
    title: "توصيل وتنسيق",
    text: "توصيل داخل المدينة وخارجها، ونجهّز الهدايا في يومها.",
  },
];

export default function ServiceStrip() {
  return (
    <section className="border-b border-ink/10 bg-cream">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-3 md:px-10 md:py-16">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <Icon className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.2} />
            <div>
              <p className="font-heading text-xl">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}