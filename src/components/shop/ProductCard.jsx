import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { BRANDS } from "@/lib/brands";
import { useCart } from "@/lib/cart";
import ProductPrice from "@/components/shop/ProductPrice";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, className = "" }) {
  const { addItem } = useCart();
  const brand = BRANDS[product.store] || BRANDS.zarqa;
  const customizable = product.personalization_type && product.personalization_type !== "none";

  return (
    <article className={cn("group relative", className)}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
          <Img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          />
          {product.badge && (
            <span className="absolute right-3 top-3 bg-cream/95 px-2.5 py-1 text-[10px] tracking-[0.18em] text-ink/70">
              {product.badge}
            </span>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </Link>

      {customizable ? (
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 bg-cream/95 py-2.5 text-xs tracking-[0.15em] text-ink opacity-0 transition-all duration-500 group-hover:opacity-100"
        >
          <span>تخصيص القطعة</span>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => addItem(product)}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 bg-cream/95 py-2.5 text-xs tracking-[0.15em] text-ink opacity-0 transition-all duration-500 hover:bg-cream group-hover:opacity-100"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>أضف للسلة</span>
        </button>
      )}

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", brand.dot)} />
            <span className="text-[10px] tracking-[0.22em] text-ink/40">{product.sub_category || product.category}</span>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="mt-1 font-heading text-xl leading-tight text-ink transition-colors group-hover:text-royal">
              {product.name}
            </h3>
          </Link>
        </div>
        <ProductPrice product={product} className="whitespace-nowrap pt-4 text-sm text-ink/70" />
      </div>
    </article>
  );
}