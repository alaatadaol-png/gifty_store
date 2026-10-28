import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, LogOut, Package, Settings, ShoppingCart, FileText, Truck, LayoutDashboard, Image as ImageIcon, Percent } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Spinner } from "@/components/admin/parts";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCustomization from "@/components/admin/AdminCustomization";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminShipping from "@/components/admin/AdminShipping";
import AdminStaticPages from "@/components/admin/AdminStaticPages";
import AdminSiteContent from "@/components/admin/AdminSiteContent";
import AdminPromotions from "@/components/admin/AdminPromotions";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { key: "overview", label: "لوحة المعلومات", icon: LayoutDashboard, Component: AdminOverview },
  { key: "products", label: "المنتجات", icon: Package, Component: AdminProducts },
  { key: "customization", label: "خيارات التخصيص", icon: Settings, Component: AdminCustomization },
  { key: "orders", label: "الطلبات", icon: ShoppingCart, Component: AdminOrders },
  { key: "shipping", label: "التوصيل", icon: Truck, Component: AdminShipping },
  { key: "pages", label: "الصفحات الثابتة", icon: FileText, Component: AdminStaticPages },
  { key: "promotions", label: "العروض", icon: Percent, Component: AdminPromotions },
  { key: "content", label: "محتوى الموقع", icon: ImageIcon, Component: AdminSiteContent },
];

export default function Admin() {
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin, logout } = useAuth();
    console.log("User Data in Admin Page:", user);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) navigateToLogin();
  }, [isLoadingAuth, isAuthenticated, navigateToLogin]);

  if (isLoadingAuth || !isAuthenticated) return <Spinner />;

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <p className="font-heading text-3xl">غير مصرّح بالوصول</p>
        <p className="mt-3 text-sm text-ink/50">
          لوحة التحكم متاحة لمستخدمي الإدارة فقط.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm text-royal">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  const ActiveComponent = SECTIONS.find((section) => section.key === active).Component;

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 bg-white/70">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <span className="font-heading text-xl text-royal">لوحة التحكم</span>
            <span className="h-3 w-px bg-ink/15" />
            <span className="text-[11px] tracking-[0.2em] text-ink/45">خرزة زرقة | MERSAL ALHOB</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link to="/" className="flex items-center gap-1.5 text-ink/60 hover:text-ink">
              <Home className="h-3.5 w-3.5" />
              المتجر
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-1.5 text-ink/60 hover:text-ink"
            >
              <LogOut className="h-3.5 w-3.5" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = section.key === active;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActive(section.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 px-4 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-ink text-cream"
                      : "text-ink/60 hover:bg-ink/5 hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {section.label}
                </button>
              );
            })}
          </nav>

          <main className="min-w-0">
            <ActiveComponent />
          </main>
        </div>
      </div>
    </div>
  );
}