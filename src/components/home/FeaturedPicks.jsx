import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ProductCard from "@/components/shop/ProductCard";

export default function FeaturedPicks() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    base44.entities.Product
      .filter({ featured: true }, { sort: "-created_date", limit: 4 })
      .then((page) => setProducts(page.items || []))
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.32em] text-gold">مختاراتنا</p>
          <h2 className="mt-2 font-heading text-4xl md:text-5xl">قطع يحبّها الجميع</h2>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/gifts" className="text-ink/60 underline decoration-gold/50 decoration-1 underline-offset-4 transition-colors hover:text-ink">
            الهدايا والورود
          </Link>
          <Link to="/accessories" className="text-ink/60 underline decoration-gold/50 decoration-1 underline-offset-4 transition-colors hover:text-ink">
            الاكسسوارات
          </Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="reveal"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}