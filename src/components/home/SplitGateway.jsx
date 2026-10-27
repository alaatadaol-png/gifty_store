import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BRANDS } from "@/lib/brands";
import { useSiteContent, contentValue } from "@/lib/siteContent";
import { cn } from "@/lib/utils";

function Panel({ brand, position, content }) {
  const isGift = brand.key === "mersal";
  const imageKey = isGift ? "hero_image_right" : "hero_image_left";
  const image = contentValue(content, imageKey, brand.heroImage);
  return (
    <Link
      to={brand.path}
      className="group relative block min-h-[64vh] overflow-hidden md:min-h-[calc(100vh-13rem)]"
    >
      <Img
        src={image}
        alt={brand.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#17100a]/85 via-[#17100a]/30 to-[#17100a]/10 transition-opacity duration-700" />
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100",
          isGift ? "bg-[#8c4f4f]/20" : "bg-[#002366]/25"
        )}
      />

      <div className="relative flex h-full flex-col justify-end p-7 md:p-12">
        <p className="text-[10px] tracking-[0.4em] text-cream/65 md:text-[11px]">
          {brand.tagline}
        </p>
        <h2
          className={cn(
            "mt-3 text-cream",
            isGift
              ? "font-body text-3xl font-light tracking-[0.22em] md:text-5xl"
              : "font-heading text-5xl md:text-6xl"
          )}
        >
          {brand.name}
        </h2>
        {isGift && (
          <p className="mt-2 font-heading text-xl text-cream/70">مرسال الحب</p>
        )}
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">
          {brand.line}
        </p>

        <span
          className={cn(
            "mt-7 inline-flex w-fit items-center gap-3 px-7 py-3.5 text-xs tracking-[0.18em] transition-all duration-500",
            isGift
              ? "border border-cream/40 bg-cream/10 text-cream backdrop-blur-md group-hover:bg-cream group-hover:text-ink"
              : "border border-royal/60 bg-cream/95 text-royal group-hover:bg-royal group-hover:text-cream"
          )}
        >
          {brand.cta}
          <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function SplitGateway() {
  const content = useSiteContent();
  return (
    <section className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Panel brand={BRANDS.mersal} position={0.45} content={content} />
        <Panel brand={BRANDS.zarqa} position={0.5} content={content} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-soft to-transparent md:block" />
    </section>
  );
}