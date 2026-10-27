import React from "react";
import StoreCatalog from "@/components/shop/StoreCatalog";
import { GIFT_TAGS } from "@/lib/products";

export default function Gifts() {
  return (
    <StoreCatalog
      brandKey="mersal"
      category="هدايا"
      kicker="MERSAL ALHOB · هدايا وورود"
      heading="تصفّحي الهدايا"
      filterLabel="حسب الوسم"
      filterField="tags"
      filters={GIFT_TAGS}
    />
  );
}