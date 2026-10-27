import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/brands";
import { productImage, productPrice, productTags } from "@/lib/products";

export default function ProductTile({ product }) {
  const image = productImage(product);
  const price = productPrice(product);
  const tags = productTags(product);

  return (
    <Link to={`/product/${product.id}`} className="group block reveal">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
        {image && (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {tags.map((tag) => (
              <span key={tag} className="bg-cream/90 px-2 py-1 text-[10px] text-ink shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col items-start">
        <h3 className="font-heading text-lg text-ink group-hover:text-gold transition-colors">{product.name}</h3>
        <p className="mt-1 text-sm text-ink/60">{formatPrice(price, product.currency)}</p>
      </div>
    </Link>
  );
}