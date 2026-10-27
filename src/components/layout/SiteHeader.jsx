import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/brands";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

function Wordmark({ compact = false }) {
  return (
    <span className="flex items-baseline gap-2.5">
      <span className={cn("font-heading text-royal", compact ? "text-xl" : "text-2xl")}>
        خرزة زرقة
      </span>
      <span className="h-3 w-px bg-gold/50" />
      <span
        className={cn(
          "font-body tracking-[0.28em] text-ink",
          compact ? "text-[10px]" : "text-[11px]"
        )}
      >
        MERSAL ALHOB
      </span>
    </span>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { count, openCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-ink/10 bg-cream/95 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-cream/95 to-cream/0"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-5 md:px-10">
        <Link to="/" className="shrink-0" aria-label="الصفحة الرئيسية">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group relative py-2 text-sm transition-colors",
                  active ? "text-royal" : "text-ink/65 hover:text-ink"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 right-0 h-px bg-gold transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium text-royal transition-colors hover:text-royal/70"
            >
              لوحة التحكم
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
            aria-label="سلة الطلبات"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
            {count > 0 && (
              <span className="absolute -top-0.5 left-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-royal px-1 text-[10px] font-medium text-cream">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
            aria-label="القائمة"
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.4} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.4} />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-ink/5 bg-cream/98 backdrop-blur-md transition-[max-height] duration-500 lg:hidden",
          menuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-6 pb-6 pt-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "border-b border-ink/5 py-3 text-sm",
                location.pathname === item.path ? "text-royal" : "text-ink/70"
              )}
            >
              {item.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={cn(
                "border-b border-ink/5 py-3 text-sm",
                location.pathname === "/admin" ? "text-royal" : "text-ink/70"
              )}
            >
              لوحة التحكم
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}