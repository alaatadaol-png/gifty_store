import React from "react";
import { formatPrice } from "@/lib/brands";
import { productPrice } from "@/lib/products";
import { useActivePromotions, promotionForProduct, discountPrice } from "@/lib/promotions";
import { cn } from "@/lib/utils";

// عرض سعر المنتج مع خصم العرض النشط (السعر الجديد عريضاً والقديم مشطوباً)
export default function ProductPrice({ product, className }) {
  const promotions = useActivePromotions();
  const promo = promotionForProduct(product, promotions);
  const original = productPrice(product);
  const currency = product.currency;

  if (!promo) {
    return <span className={className}>{formatPrice(original, currency)}</span>;
  }

  const discounted = discountPrice(original, promo);
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-heading text-[#9c5c5c]">{formatPrice(discounted, currency)}</span>
      <span className="text-xs text-ink/40 line-through">{formatPrice(original, currency)}</span>
    </span>
  );
}