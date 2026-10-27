import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BRANDS, formatPrice, formatMultiCurrency } from "@/lib/brands";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

function CartLine({ item, onRemove, onQuantity }) {
  const brand = BRANDS[item.store] || BRANDS.zarqa;
  return (
    <li className="flex gap-4 border-b border-ink/8 py-5">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-ink/5">
        {/* تم استبدال Image بـ img هنا */}
        <img
          src={item.image_url}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", brand.dot)} />
          <span className="text-[10px] tracking-[0.2em] text-ink/45">{brand.short}</span>
        </div>
        <p className="mt-1 truncate font-heading text-lg leading-tight">{item.name}</p>
        {item.personalization && (
          <p className="mt-0.5 truncate text-xs text-ink/50">{item.personalization}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3 border border-ink/15 px-2 py-1">
            <button
              type="button"
              onClick={() => onQuantity(item.lineId, item.quantity - 1)}
              aria-label="تقليل"
              className="text-ink/50 hover:text-ink"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-4 text-center text-xs">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantity(item.lineId, item.quantity + 1)}
              aria-label="زيادة"
              className="text-ink/50 hover:text-ink"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">{formatPrice(item.price * item.quantity, item.currency)}</span>
            <button
              type="button"
              onClick={() => onRemove(item.lineId)}
              className="text-ink/35 transition-colors hover:text-destructive"
              aria-label="إزالة"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function CartDrawer() {
  const { isOpen, closeCart, items, total, totalsByCurrency, currencyKeys, removeItem, updateQuantity, clear, lines } = useCart();
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState({ customer_name: "", phone: "", city: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [orderCode, setOrderCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.customer_name.trim() || !form.phone.trim()) return;
    setSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: form.customer_name,
            phone: form.phone,
            address: form.city,
            items: lines, 
            items_summary: [...lines, `المجموع: ${formatMultiCurrency(totalsByCurrency)}`].join("\n"),
            sub_total: total,
            shipping_fee: 0,
            total: total,
            status: "قيد الانتظار",
            notes: form.notes
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setOrderCode(String(data.id || "").slice(-6).toUpperCase());
      clear();
      setStep("done");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const close = () => {
    closeCart();
    if (step === "done") {
      setStep("cart");
      setForm({ customer_name: "", phone: "", city: "", notes: "" });
    }
  };

  return (
    <>
      <div
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="font-heading text-2xl">سلة الطلبات</p>
            <p className="text-[11px] tracking-[0.2em] text-ink/40">من المتجرين معاً</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="إغلاق"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {step === "done" ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
                <Check className="h-6 w-6" strokeWidth={1.4} />
              </span>
              <p className="mt-6 font-heading text-2xl">وصلنا طلبك</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
                سنتواصل معك على رقمك لتأكيد التفاصيل وموعد التوصيل.
              </p>
              {orderCode && (
                <p className="mt-4 text-xs tracking-[0.2em] text-ink/45">
                  رقم الطلب: {orderCode}
                </p>
              )}
              <Button variant="outline" className="mt-8 rounded-none" onClick={close}>
                متابعة التسوّق
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="h-7 w-7 text-ink/25" strokeWidth={1.2} />
              <p className="mt-5 font-heading text-xl text-ink/70">سلتك فارغة حالياً</p>
              <p className="mt-2 max-w-[16rem] text-sm text-ink/45">
                اختاري قطعة من الاكسسوارات أو بوكيه من الهدايا لتبدأ الحكاية.
              </p>
              <div className="mt-7 flex gap-3">
                <Link to="/gifts" onClick={close}>
                  <Button variant="outline" className="rounded-none">الهدايا</Button>
                </Link>
                <Link to="/accessories" onClick={close}>
                  <Button variant="outline" className="rounded-none">الاكسسوارات</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul>
                {items.map((item) => (
                  <CartLine
                    key={item.lineId}
                    item={item}
                    onRemove={removeItem}
                    onQuantity={updateQuantity}
                  />
                ))}
              </ul>

              {step === "checkout" && (
                <form id="order-form" onSubmit={handleSubmit} className="space-y-3 py-6">
                  <p className="font-heading text-lg">بيانات التوصيل</p>
                  <Input
                    required
                    placeholder="الاسم الكامل"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    className="rounded-none border-ink/20 bg-white/60"
                  />
                  <Input
                    required
                    placeholder="رقم الهاتف / واتساب"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-none border-ink/20 bg-white/60"
                  />
                  <Input
                    placeholder="المدينة / العنوان"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="rounded-none border-ink/20 bg-white/60"
                  />
                  <Textarea
                    placeholder="ملاحظات على الطلب (اختياري)"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="rounded-none border-ink/20 bg-white/60"
                  />
                </form>
              )}
            </>
          )}
        </div>

        {items.length > 0 && step !== "done" && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-ink/55">المجموع</span>
              <span className={cn("font-heading text-left", currencyKeys.length > 1 ? "text-base leading-snug" : "text-2xl")}>
                {formatMultiCurrency(totalsByCurrency)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-ink/40">
              التوصيل يُحسب حسب المدينة عند التأكيد.
            </p>
            {step === "cart" ? (
              <Button
                onClick={() => setStep("checkout")}
                className="mt-4 w-full rounded-none bg-royal py-6 text-sm tracking-wide text-cream hover:bg-royal/90"
              >
                متابعة الطلب
              </Button>
            ) : (
              <div className="mt-4 flex gap-3">
                <Button
                  type="submit"
                  form="order-form"
                  disabled={saving}
                  className="flex-1 rounded-none bg-royal py-6 text-sm tracking-wide text-cream hover:bg-royal/90"
                >
                  {saving ? "جارٍ الإرسال..." : "تأكيد الطلب"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("cart")}
                  className="rounded-none border-ink/20 py-6"
                >
                  رجوع
                </Button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}