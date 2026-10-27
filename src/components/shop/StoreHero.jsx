import React from "react";

export default function StoreHero({ brand, title, kicker }) {
  return (
    <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-ink py-20 text-center text-cream md:min-h-[50vh]">
      <div className="absolute inset-0 opacity-40">
        {brand.heroImage && (
          <img
            src={brand.heroImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-5">
        <p className="text-[11px] tracking-[0.4em] text-gold-soft">{kicker}</p>
        <h1 className="mt-4 font-heading text-4xl leading-tight md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-cream/80 md:text-base">
          {brand.line}
        </p>
      </div>
    </section>
  );
}