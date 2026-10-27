import React from "react";
import StoreCatalog from "@/components/shop/StoreCatalog";
import { ACCESSORY_CATEGORIES } from "@/lib/brands";

export default function Accessories() {
  return (
    <StoreCatalog
      brandKey="zarqa"
      category="اكسسوارات"
      kicker="خرزة زرقة · اكسسوارات يدوية"
      heading="تصفّحي الاكسسوارات"
      filterLabel="حسب النوع"
      filterField="sub_category"
      filters={ACCESSORY_CATEGORIES.slice(1)}
    />
  );
}