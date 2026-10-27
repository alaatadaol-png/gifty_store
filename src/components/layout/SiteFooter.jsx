import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { NAV_ITEMS, SITE } from "@/lib/brands";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-[#F7F1E9]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-heading text-3xl text-royal">خرزة زرقة</p>
            <p className="mt-1 text-xs tracking-[0.3em] text-ink/50">HANDMADE ACCESSORIES</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/65">
              مشغل صغير يصنع الاكسسوارات قطعةً قطعة باليد — أحجار طبيعية وتفاصيل لا تتكرّر.
            </p>
          </div>

          <div>
            <p className="font-heading text-3xl text-[#9c5c5c]">MERSAL ALHOB</p>
            <p className="mt-1 text-xs tracking-[0.3em] text-ink/50">مرسال الحب</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/65">
              هدايا وورود وتغليف فاخر، تُنسّق بعناية لتحمل رسالتك إلى من تحب.
            </p>
          </div>

          <div>
            <p className="font-heading text-xl text-ink">تنقّل سريع</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-ink/60 transition-colors hover:text-royal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-ink/10 pt-8 sm:flex-row">
          <p className="text-xs text-ink/45">
            © {new Date().getFullYear()} خرزة زرقة &amp; MERSAL ALHOB — جميع الحقوق محفوظة
          </p>
          <div className="flex items-center gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="إنستغرام"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-all hover:border-gold hover:text-gold"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="فيسبوك"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-all hover:border-gold hover:text-gold"
            >
              <Facebook className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <Link
              to="/contact"
              aria-label="تواصل معنا عبر واتساب"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-all hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}