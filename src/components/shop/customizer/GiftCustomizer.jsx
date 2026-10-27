import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BoxStep from "@/components/shop/customizer/BoxStep";
import SizeStep from "@/components/shop/customizer/SizeStep";
import FlowerStep from "@/components/shop/customizer/FlowerStep";
import WrappingStep from "@/components/shop/customizer/WrappingStep";
import AddonStep from "@/components/shop/customizer/AddonStep";
import ReviewStep from "@/components/shop/customizer/ReviewStep";
import GiftSummary from "@/components/shop/customizer/GiftSummary";
import { useCart } from "@/lib/cart";
import { cartProduct } from "@/lib/products";
import { formatMultiCurrency } from "@/lib/brands";
import {
  blockedSizeNames,
  computeGiftTotals,
  defaultStems,
  stemLimits,
} from "@/lib/giftPricing";
import { cn } from "@/lib/utils";

const STEPS = ["الصندوق", "الحجم", "الورود", "التغليف", "الإضافات", "المعاينة"];

const readList = async (entity) => {
  const { data } = await supabase.from(entity).select("*").order("id", { ascending: false });
  return data || [];
};

export default function GiftCustomizer({ open, onOpenChange, product }) {
  const { addItem } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ boxes: [], sizes: [], flowers: [], wrappings: [], addons: [] });
  const [boxId, setBoxId] = useState(null);
  const [sizeId, setSizeId] = useState(null);
  const [flowerId, setFlowerId] = useState(null);
  const [stems, setStems] = useState(1);
  const [wrappingId, setWrappingId] = useState(null);
  const [addonIds, setAddonIds] = useState([]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setStep(0);
    setBoxId(null);
    setSizeId(null);
    setFlowerId(null);
    setStems(1);
    setWrappingId(null);
    setAddonIds([]);
    setLoading(true);

    Promise.all([
      readList("gift_boxes"),
      readList("gift_sizes"),
      readList("gift_flowers"),
      readList("gift_wrappings"),
      readList("gift_addons"),
    ])
      .then(([boxes, sizes, flowers, wrappings, addons]) => {
        if (!active) return;
        setData({ boxes, sizes, flowers, wrappings, addons });
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open]);

  const box = data.boxes.find((item) => item.id === boxId) || null;
  const blockedNames = blockedSizeNames(box);
  const sizes = data.sizes.filter((size) => !blockedNames.includes(size.name));
  const size = sizes.find((item) => item.id === sizeId) || null;
  const flower = data.flowers.find((item) => item.id === flowerId) || null;
  const wrapping = data.wrappings.find((item) => item.id === wrappingId) || null;
  const addons = data.addons.filter((item) => addonIds.includes(item.id));
  const limits = stemLimits(size);
  const totals = computeGiftTotals({ box, size, flower, stems, wrapping, addons });

  useEffect(() => {
    if (!size) return;
    const { min, max } = stemLimits(size);
    setStems((current) => {
      if (!current) return defaultStems(size);
      return max ? Math.min(Math.max(current, min), max) : Math.max(current, min);
    });
  }, [size?.id]);

  const handleBox = (id) => {
    setBoxId(id);
    const nextBlocked = blockedSizeNames(data.boxes.find((item) => item.id === id));
    const currentSize = data.sizes.find((item) => item.id === sizeId);
    if (currentSize && nextBlocked.includes(currentSize.name)) setSizeId(null);
  };

  const handleSize = (id) => {
    setSizeId(id);
    setStems(defaultStems(data.sizes.find((item) => item.id === id)));
  };

  const toggleAddon = (id) =>
    setAddonIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const canNext = [
    Boolean(box),
    Boolean(size),
    Boolean(flower) && Number(stems) >= limits.min && (!limits.max || Number(stems) <= limits.max),
    Boolean(wrapping),
    true,
    true,
  ][step];

  const handleAdd = () => {
    const summary = [
      `الصندوق: ${box.name}`,
      `الحجم: ${size.name}`,
      `الورود: ${flower.name} × ${totals.flowerCount}`,
      `التغليف: ${wrapping.name}`,
      addons.length ? `الإضافات: ${addons.map((addon) => addon.name).join("، ")}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    const base = cartProduct(product);
    const giftCurrencies = Object.keys(totals.totalsByCurrency).filter(
      (key) => totals.totalsByCurrency[key] > 0
    );
    const giftCurrency = giftCurrencies.length === 1 ? giftCurrencies[0] : base.currency;
    onOpenChange(false);
    addItem(
      {
        ...base,
        name: `${base.name} — مخصصة`,
        store: base.store || "mersal",
        price: totals.total,
        currency: giftCurrency,
        image_url: box.image || base.image_url,
      },
      summary,
      1
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[94vh] max-w-4xl flex-col gap-0 overflow-hidden rounded-none border-ink/10 bg-cream p-0">
        <DialogHeader className="space-y-0 border-b border-ink/10 bg-cream px-5 py-5 md:px-8">
          <DialogTitle className="font-heading text-2xl">خصّصي هديتك</DialogTitle>
          <DialogDescription className="mt-1 text-xs text-ink/50">
            {product?.name} — الخطوة {step + 1} من {STEPS.length}: {STEPS[step]}
          </DialogDescription>

          <div className="mt-4 flex items-center gap-1.5">
            {STEPS.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => index <= step && setStep(index)}
                className={cn(
                  "h-1 flex-1 transition-colors duration-300",
                  index <= step ? "bg-ink" : "bg-ink/15"
                )}
                aria-label={label}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
          {loading ? (
            <div className="space-y-3 py-10">
              {[0, 1, 2].map((row) => (
                <div key={row} className="h-14 w-full animate-pulse bg-ink/5" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                {step === 0 && (
                  <BoxStep boxes={data.boxes} value={boxId} onChange={handleBox} />
                )}
                {step === 1 && (
                  <SizeStep
                    sizes={sizes}
                    value={sizeId}
                    onChange={handleSize}
                    blockedNames={blockedNames}
                    box={box}
                  />
                )}
                {step === 2 && (
                  <FlowerStep
                    flowers={data.flowers}
                    flowerId={flowerId}
                    onFlowerChange={setFlowerId}
                    stems={stems}
                    onStemsChange={setStems}
                    size={size}
                    min={limits.min}
                    max={limits.max}
                  />
                )}
                {step === 3 && (
                  <WrappingStep
                    wrappings={data.wrappings}
                    value={wrappingId}
                    onChange={setWrappingId}
                  />
                )}
                {step === 4 && (
                  <AddonStep addons={data.addons} value={addonIds} onToggle={toggleAddon} />
                )}
                {step === 5 && (
                  <ReviewStep
                    product={product}
                    box={box}
                    size={size}
                    flower={flower}
                    stems={stems}
                    wrapping={wrapping}
                    addons={addons}
                    totals={totals}
                  />
                )}
              </div>

              <aside className="hidden md:block">
                <div className="sticky top-0">
                  <GiftSummary
                    box={box}
                    size={size}
                    flower={flower}
                    stems={stems}
                    wrapping={wrapping}
                    addons={addons}
                    totals={totals}
                  />
                </div>
              </aside>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-ink/10 bg-cream px-5 py-4 md:px-8">
          <Button
            variant="ghost"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0 || loading}
            className="rounded-none px-4 text-ink/60 hover:bg-ink/5"
          >
            السابق
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-left md:hidden">
              <p className="text-[10px] text-ink/40">الإجمالي</p>
              <p className="font-heading text-lg leading-tight">{formatMultiCurrency(totals.totalsByCurrency)}</p>
            </div>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep((value) => value + 1)}
                disabled={!canNext || loading}
                className="rounded-none bg-ink px-8 text-cream hover:bg-ink/90"
              >
                التالي
              </Button>
            ) : (
              <Button
                onClick={handleAdd}
                disabled={!canNext}
                className="rounded-none bg-[#9c5c5c] px-5 text-cream hover:bg-[#8a5050]"
              >
                أضف الهدية المخصصة إلى السلة
              </Button>
            )}
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}