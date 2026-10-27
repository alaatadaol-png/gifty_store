import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ClosingCta() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <div className="relative overflow-hidden border border-gold/30 bg-gradient-to-l from-[#FBF2EF] via-cream to-[#F4F7FD] px-6 py-16 text-center md:px-16 md:py-20">
        <p className="text-[11px] tracking-[0.36em] text-gold">هدية تُحكى</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-heading text-4xl leading-tight md:text-5xl">
          أخبرينا بالمناسبة، ونحن نهتم بالتفاصيل
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/55">
          تنسيق خاص للمناسبات، طلبات بالكميات، أو قطعة اكسسوار بتصميم يخصّك — راسلينا
          ونرتّبها معك.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/contact">
            <Button className="rounded-none bg-royal px-8 py-6 text-sm tracking-wide text-cream hover:bg-royal/90">
              تواصلي معنا
            </Button>
          </Link>
          <Link to="/gifts">
            <Button variant="outline" className="rounded-none border-ink/25 px-8 py-6 text-sm tracking-wide">
              تصفّحي الهدايا
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}