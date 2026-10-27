import React from "react";
import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CartDrawer from "@/components/cart/CartDrawer";

export default function SiteLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-cream text-ink">
      <SiteHeader />
      <main className="pt-20">
        <Outlet />
      </main>
      <SiteFooter />
      <CartDrawer />
    </div>
  );
}