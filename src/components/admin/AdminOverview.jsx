import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Spinner, StatCard } from "@/components/admin/parts";
import { formatPrice } from "@/lib/brands";

export default function AdminOverview() {
  const [stats, setStats] = useState({ newOrders: 0, sales: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // جلب الطلبات
        const { data: orders } = await supabase.from("orders").select("*");
        // جلب المنتجات
        const { count: productsCount } = await supabase.from("products").select("*", { count: 'exact', head: true });

        let newOrders = 0;
        let totalSales = 0;

        if (orders) {
          newOrders = orders.filter(o => o.status === "قيد الانتظار").length;
          totalSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        }

        setStats({ 
          newOrders, 
          sales: totalSales, 
          products: productsCount || 0 
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="font-heading text-2xl">لوحة المعلومات</h2>
      <p className="mt-1 text-sm text-ink/50">نظرة سريعة على أداء المتجر.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="طلبات جديدة" value={stats.newOrders} hint="قيد الانتظار" />
        <StatCard label="إجمالي المبيعات" value={formatPrice(stats.sales)} hint="من جميع الطلبات" />
        <StatCard label="المنتجات النشطة" value={stats.products} hint="في الكتالوج" />
      </div>
    </div>
  );
}