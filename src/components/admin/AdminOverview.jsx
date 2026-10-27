import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Spinner, StatCard } from "@/components/admin/parts";
import { formatPrice } from "@/lib/brands";

export default function AdminOverview() {
  const [stats, setStats] = useState({ newOrders: 0, sales: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Order.count({ status: "قيد الانتظار" }),
      base44.entities.Order.aggregate({ sum: ["total"] }),
      base44.entities.Product.count({}),
    ])
      .then(([newOrders, salesAgg, products]) => {
        const sales = salesAgg?.rows?.[0]?.sum_total || 0;
        setStats({ newOrders, sales, products });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="font-heading text-2xl">لوحة المعلومات</h2>
      <p className="mt-1 text-sm text-ink/50">نظرة سريعة على أداء المتجر.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="طلبات جديدة"
          value={stats.newOrders}
          hint="قيد الانتظار"
        />
        <StatCard
          label="إجمالي المبيعات"
          value={formatPrice(stats.sales)}
          hint="من جميع الطلبات"
        />
        <StatCard
          label="المنتجات النشطة"
          value={stats.products}
          hint="في الكتالوج"
        />
      </div>
    </div>
  );
}