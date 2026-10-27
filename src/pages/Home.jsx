import React from "react";
import SplitGateway from "@/components/home/SplitGateway";
import ServiceStrip from "@/components/home/ServiceStrip";
import FeaturedPicks from "@/components/home/FeaturedPicks";
import BrandStory from "@/components/home/BrandStory";
import ClosingCta from "@/components/home/ClosingCta";
import PromoBanner from "@/components/home/PromoBanner";
import { useSiteContent, contentValue } from "@/lib/siteContent";

export default function Home() {
  const content = useSiteContent();
  const kicker = contentValue(content, "home_kicker", "مرحباً بك في بيتنا الصغير");
  const heading = contentValue(
    content,
    "home_heading",
    "علامتان تحت مظلة واحدة: صناعة بيد، وإهداء بقلب"
  );
  const subheading = contentValue(
    content,
    "home_subheading",
    "اختاري عالمك — اكسسوارات مصنوعة قطعةً قطعة، أو هدايا وورود تُنسّق لتحمل شعورك إلى من تحب."
  );

  return (
    <div>
      <PromoBanner />
      <section className="border-b border-ink/10 bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
          <p className="reveal text-[11px] tracking-[0.4em] text-gold">{kicker}</p>
          <h1 className="reveal mx-auto mt-4 max-w-3xl font-heading text-4xl leading-[1.25] md:text-6xl">
            {heading}
          </h1>
          <p className="reveal mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink/55 md:text-base">
            {subheading}
          </p>
        </div>
      </section>

      <SplitGateway />
      <ServiceStrip />
      <FeaturedPicks />
      <BrandStory />
      <ClosingCta />
    </div>
  );
}