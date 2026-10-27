import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import StoreHero from "@/components/shop/StoreHero";
import CategoryFilter from "@/components/shop/CategoryFilter";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { BRANDS } from "@/lib/brands";

export default function StorePage({ storeKey, categories, kicker }) {
  const brand = BRANDS[storeKey];
  const [category, setCategory] = useState(categories[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const query = { store: storeKey };
    if (category !== categories[0]) query.category = category;

    base44.entities.Product
      .filter(query, { sort: "-created_date", limit: 100 })
      .then((page) => {
        if (!active) return;
        setProducts(page.items || []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [storeKey, category, categories]);

  return (
    <div>
      <StoreHero brand={brand} title={brand.name} kicker={kicker} />

      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
        <div className="flex flex-col gap-6 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.32em] text-gold">المجموعة</p>
            <h2 className="mt-2 font-heading text-3xl md:text-4xl">تصفّحي التصنيفات</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/50">
            {brand.line} — كل قطعة تُصنع أو تُنسّق يدوياً عند الطلب.
          </p>
        </div>

        <div className="mt-6">
          <CategoryFilter categories={categories} active={category} onChange={setCategory} />
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] w-full bg-ink/5" />
                <div className="mt-4 h-3 w-2/3 bg-ink/5" />
                <div className="mt-2 h-3 w-1/3 bg-ink/5" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-heading text-2xl text-ink/70">لا توجد قطع في هذا التصنيف بعد</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-ink/45">
              نضيف قطعاً جديدة باستمرار — تصفّحي تصنيفاً آخر أو تواصلي معنا لطلب خاص.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="mt-7 rounded-none">اطلبي قطعة خاصة</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="reveal"
                style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="mx-auto max-w-[1400px] px-5 pb-4 md:px-10">
        <div className="flex flex-col items-center gap-5 border-y border-ink/10 py-14 text-center">
          <p className="text-[11px] tracking-[0.32em] text-gold">طلب خاص</p>
          <h2 className="max-w-2xl font-heading text-3xl leading-snug md:text-4xl">
            تبحثين عن قطعة أو تنسيق خاص بمناسبتك؟
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-ink/55">
            نعمل على الطلبات الخاصة والألوان والقياسات حسب رغبتك، ونجهّز طلبات المناسبات بكميات.
          </p>
          <Link to="/contact">
            <Button className="rounded-none bg-ink px-8 py-6 text-sm tracking-wide text-cream hover:bg-ink/90">
              تواصلي معنا
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}