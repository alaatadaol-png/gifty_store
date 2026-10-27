import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { NAV_ITEMS } from "@/lib/brands";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { count, openCart } = useCart();

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        
        {/* الشعار */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-lg font-heading tracking-wide md:text-xl">
          <span className="text-royal">خرزة زرقة</span>
          <span className="text-ink/30">|</span>
          <span className="text-[#9c5c5c]">MERSAL ALHOB</span>
        </Link>

        {/* روابط سطح المكتب */}
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "transition-colors hover:text-gold",
                location.pathname === item.path ? "text-ink font-medium" : "text-ink/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* الأزرار الجانبية (تسجيل الدخول والسلة) */}
        <div className="flex items-center gap-4">
          {/* زر الحساب الشخصي / لوحة التحكم */}
          <Link 
            to="/account" 
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
            title="حسابي / لوحة التحكم"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>

          {/* زر السلة */}
          <button
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-royal text-[10px] text-cream">
                {count}
              </span>
            )}
          </button>

          {/* زر القائمة للموبايل */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل المنسدلة */}
      {isOpen && (
        <div className="border-t border-ink/10 bg-cream px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-4 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={cn(
                  "transition-colors hover:text-gold",
                  location.pathname === item.path ? "text-ink font-medium" : "text-ink/60"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px w-full bg-ink/10 my-2" />
            <Link to="/login" onClick={closeMenu} className="text-royal font-medium">
              تسجيل الدخول / لوحة التحكم
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}