import React from "react";

export default function StoreHero({ brand, title, kicker }) {
  return (
    <section className="relative">
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <Img
          src={brand.heroImage}
          alt={brand.name}
          className="h-full w-full object-cover"
          
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1206]/70 via-[#1a1206]/25 to-[#1a1206]/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1400px] px-5 pb-12 md:px-10 md:pb-16">
            <p className="reveal text-[11px] tracking-[0.35em] text-cream/70">{kicker}</p>
            <h1 className="reveal mt-3 font-heading text-5xl leading-[1.1] text-cream md:text-7xl">
              {title}
            </h1>
            <p className="reveal mt-4 max-w-xl text-sm leading-relaxed text-cream/80 md:text-base">
              {brand.intro}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}