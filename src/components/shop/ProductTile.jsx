import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { productImage, productTags } from "@/lib/products";
import ProductPrice from "@/components/shop/ProductPrice";

export default function ProductTile({ product }) {
  const image = productImage(product);
  const tag = productTags(product)[0];

  return (
    <article className="reveal group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
          {image && (
            <Img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
              
            />
          )}
          {tag && (
            <span className="absolute right-3 top-3 bg-cream/95 px-2.5 py-1 text-[10px] tracking-[0.18em] text-ink/70">
              {tag}
            </span>
          )}
        </div>
        <div className="mt-4">
          <span className="text-[10px] tracking-[0.22em] text-ink/40">
            {product.sub_category || product.category}
          </span>
          <h3 className="mt-1 font-heading text-xl leading-tight text-ink transition-colors group-hover:text-gold">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-2">
            <ProductPrice product={product} className="text-sm text-ink/70" />
            <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-gold">
              اكتشف المزيد
              <ArrowLeft className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}