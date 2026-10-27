import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Sparkles } from "lucide-react";
import { supabase } from "@/api/supabaseClient"; // تم التعديل هنا
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shop/ProductCard";
import ProductGallery from "@/components/shop/ProductGallery";
import AccessoryOptions from "@/components/shop/AccessoryOptions";
import GiftCustomizer from "@/components/shop/customizer/GiftCustomizer";
import { formatPrice } from "@/lib/brands";
import {
  accessoryTotal,
  brandForProduct,
  cartProduct,
  isCustomizable,
  productImages,
  productPrice,
  productTags,
} from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useActivePromotions, promotionForProduct, discountPrice } from "@/lib/promotions";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [options, setOptions] = useState([]);
  const [selections, setSelections] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const promotions = useActivePromotions();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setQuantity(1);
    setSelections({});

    // جلب المنتج من Supabase
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data: record, error }) => {
        if (error || !record) {
          if (active) { setProduct(null); setLoading(false); }
          return;
        }
        if (!active) return;
        setProduct(record);
        setLoading(false);

        // جلب المنتجات المشابهة
        supabase
          .from('products')
          .select('*')
          .eq('category', record.category)
          .limit(6)
          .then(({ data: relatedData }) => {
            if (!active || !relatedData) return;
            setRelated(relatedData.filter((item) => item.id !== record.id).slice(0, 3));
          });

        // جلب خيارات الاكسسوارات إذا كان المنتج اكسسوار
        if (record.category === "اكسسوارات") {
          supabase
            .from('accessory_options')
            .select('*')
            .then(({ data: optionsData }) => {
              if (!active || !optionsData) return;
              // إذا كان المنتج مرتبطاً بخيارات محددة (مصفوفة IDs)
              const linked = record.accessory_option_ids || [];
              setOptions(linked.length ? optionsData.filter((o) => linked.includes(o.id)) : optionsData);
            });
        }
      });

    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-2 md:px-10">
        <div className="aspect-[4/5] w-full animate-pulse bg-ink/5" />
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse bg-ink/5" />
          <div className="h-8 w-2/3 animate-pulse bg-ink/5" />
          <div className="h-4 w-1/3 animate-pulse bg-ink/5" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <p className="font-heading text-3xl">لم نجد هذه القطعة</p>
        <p className="mt-3 text-sm text-ink/50">ربما تم حذفها أو تغيّر رابطها.</p>
        <Link to="/">
          <Button variant="outline" className="mt-7 rounded-none">العودة للرئيسية</Button>
        </Link>
      </div>
    );
  }

  const brand = brandForProduct(product);
  const images = productImages(product);
  const tags = productTags(product);
  const isGift = product.category === "هدايا";
  const customizable = isGift && isCustomizable(product);

  const selectionSummary = options
    .map((option) => {
      const value = (selections[option.option_name] || "").trim();
      return value ? `${option.option_name}: ${value}` : "";
    })
    .filter(Boolean)
    .join(" · ");

  const promo = promotionForProduct(product, promotions);
  const basePrice = productPrice(product);
  const discountedBase = promo ? discountPrice(basePrice, promo) : basePrice;
  const optionsTotal = accessoryTotal(options, selections);
  const totalPrice = discountedBase + optionsTotal;
  const originalTotal = promo ? basePrice + optionsTotal : null;

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-5 pt-8 md:px-10">
        <div className="flex items-center gap-2 text-xs text-ink/45">
          <Link to={brand.path} className="transition-colors hover:text-ink">
            {brand.name}
          </Link>
          <span>/</span>
          <span className="text-ink/65">{product.sub_category || product.category}</span>
        </div>
      </div>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-8 md:grid-cols-2 md:gap-16 md:px-10 md:py-12">
        <ProductGallery images={images} name={product.name} badge={tags[0]} />

        <div className="md:pt-6">
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", brand.dot)} />
            <span className="text-[10px] tracking-[0.3em] text-ink/45">
              {isGift ? "MERSAL ALHOB" : "خرزة زرقة"}
            </span>
          </div>

          <h1 className="mt-3 font-heading text-4xl leading-tight md:text-5xl">
            {product.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <p className="font-heading text-2xl text-ink/75">
              {formatPrice(totalPrice, product.currency)}
            </p>
            {promo && (
              <>
                <span className="text-base text-ink/40 line-through">
                  {formatPrice(originalTotal, product.currency)}
                </span>
                <span className="border border-[#9c5c5c]/40 bg-[#9c5c5c]/5 px-2 py-0.5 text-[11px] text-[#9c5c5c]">
                  خصم {promo.discount_percentage}%
                </span>
              </>
            )}
            {!promo && optionsTotal > 0 && (
              <span className="text-xs text-ink/45">
                يشمل خيارات التخصيص (+{formatPrice(optionsTotal, product.currency)})
              </span>
            )}
          </div>

          {(tags.length > 0 || product.category) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="border border-ink/15 px-2.5 py-1 text-ink/55">
                {product.category}
              </span>
              {product.sub_category && (
                <span className="border border-ink/15 px-2.5 py-1 text-ink/55">
                  {product.sub_category}
                </span>
              )}
              {tags.map((tag) => (
                <span key={tag} className="border border-gold/40 px-2.5 py-1 text-gold">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {product.description && (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60 md:text-base">
              {product.description}
            </p>
          )}

          {(product.material || product.materials) && (
            <div className="mt-7 border-t border-ink/10 pt-5">
              <p className="text-[11px] tracking-[0.28em] text-gold">المواد والتفاصيل</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/55">
                {product.material || product.materials}
              </p>
            </div>
          )}

          <div className="mt-8">
            {customizable ? (
              <Button
                onClick={() => setCustomizerOpen(true)}
                className="w-full gap-2 rounded-none bg-[#9c5c5c] py-7 text-sm tracking-[0.1em] text-cream shadow-sm hover:bg-[#8a5050] sm:w-auto sm:px-14"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.4} />
                <span>خصّص هديتك الآن</span>
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-4 border border-ink/20 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    aria-label="تقليل"
                    className="text-ink/50 transition-colors hover:text-ink"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-5 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    aria-label="زيادة"
                    className="text-ink/50 transition-colors hover:text-ink"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Button
                  onClick={() =>
                    addItem(
                      { ...cartProduct(product), price: totalPrice },
                      selectionSummary,
                      quantity
                    )
                  }
                  disabled={product.in_stock === false}
                  className={cn(
                    "flex-1 rounded-none py-6 text-sm tracking-wide text-cream sm:flex-none sm:px-12",
                    isGift
                      ? "bg-[#9c5c5c] hover:bg-[#8a5050]"
                      : "bg-royal hover:bg-royal/90"
                  )}
                >
                  {product.in_stock === false ? "غير متوفّر حالياً" : "أضف إلى السلة"}
                </Button>
              </div>
            )}
          </div>

          {!isGift && (
            <AccessoryOptions
              options={options}
              values={selections}
              onChange={(name, value) =>
                setSelections((current) => ({ ...current, [name]: value }))
              }
            />
          )}

          <div className="mt-8 flex items-start gap-3 border-t border-ink/10 pt-5 text-xs leading-relaxed text-ink/50">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.2} />
            <p>
              يُصنّع الطلب يدوياً بعد التأكيد، ويصلك مع تغليف هدية وبطاقة إهداء. للتوصيل
              خارج المدينة راسلينا.
            </p>
          </div>

          <Link
            to={brand.path}
            className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.18em] text-ink/60 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            عودة إلى {brand.name}
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pb-8 pt-6 md:px-10">
          <div className="border-t border-ink/10 pt-10">
            <h2 className="font-heading text-3xl">قد يناسبك أيضاً</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <GiftCustomizer
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        product={product}
      />
    </div>
  );
}