import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";
import { EmptyState, RowActions, Spinner, confirmDelete } from "@/components/admin/parts";
import { formatPrice } from "@/lib/brands";

const readList = async (entity) => {
  const result = await base44.entities[entity].list("-created_date", 100);
  return Array.isArray(result) ? result : result.items || [];
};

const emptyForm = {
  title: "",
  description: "",
  discount_percentage: 0,
  start_date: "",
  end_date: "",
  is_active: true,
  applicable_products: [],
};

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([readList("Promotion"), readList("Product")])
      .then(([promos, prods]) => {
        setPromotions(promos);
        setProducts(prods);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const startAdd = () => {
    setEditing({});
    setForm(emptyForm);
    setProductSearch("");
  };
  const startEdit = (promo) => {
    setEditing(promo);
    setForm({ ...emptyForm, ...promo, applicable_products: promo.applicable_products || [] });
    setProductSearch("");
  };

  const toggleProduct = (id) =>
    setForm((current) => ({
      ...current,
      applicable_products: current.applicable_products.includes(id)
        ? current.applicable_products.filter((p) => p !== id)
        : [...current.applicable_products, id],
    }));

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        (product.name || "").includes(productSearch.trim())
      ),
    [products, productSearch]
  );

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description,
        discount_percentage: Number(form.discount_percentage || 0),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        is_active: Boolean(form.is_active),
        applicable_products: form.applicable_products,
      };
      if (editing?.id) {
        await base44.entities.Promotion.update(editing.id, payload);
      } else {
        await base44.entities.Promotion.create(payload);
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (promo) => {
    if (!confirmDelete(`حذف العرض «${promo.title}»؟`)) return;
    await base44.entities.Promotion.delete(promo.id);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-4">
        <div>
          <h2 className="font-heading text-2xl">إدارة العروض</h2>
          <p className="mt-1 text-sm text-ink/50">أنشئي عروض خصم واربطيها بمنتجات محددة.</p>
        </div>
        <Button
          onClick={startAdd}
          className="rounded-none bg-ink px-5 py-3 text-xs text-cream hover:bg-ink/90"
        >
          إضافة عرض
        </Button>
      </div>

      <div className="mt-5">
        {loading ? (
          <Spinner />
        ) : promotions.length === 0 ? (
          <EmptyState message="لا توجد عروض بعد." />
        ) : (
          <ul className="divide-y divide-ink/8 border border-ink/10 bg-white/60">
            {promotions.map((promo) => (
              <li key={promo.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm text-ink">{promo.title}</p>
                    <span className="border border-gold/40 px-1.5 py-0.5 text-[10px] text-gold">
                      {promo.discount_percentage}% خصم
                    </span>
                    <span className={`px-1.5 py-0.5 text-[10px] ${promo.is_active ? "text-royal" : "text-ink/40"}`}>
                      {promo.is_active ? "نشط" : "متوقف"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-ink/45">
                    {promo.start_date || "—"} إلى {promo.end_date || "—"}
                    {promo.applicable_products?.length
                      ? ` · ${promo.applicable_products.length} منتج`
                      : " · كل المنتجات"}
                  </p>
                </div>
                <RowActions onEdit={() => startEdit(promo)} onDelete={() => remove(promo)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-none border-ink/10 bg-cream">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              {editing?.id ? "تعديل العرض" : "إضافة عرض"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>اسم العرض</Label>
              <Input
                required
                value={form.title}
                onChange={(event) => set("title", event.target.value)}
                className="mt-1.5 rounded-none border-ink/20 bg-white"
              />
            </div>

            <div>
              <Label>تفاصيل العرض</Label>
              <Textarea
                rows={2}
                value={form.description}
                onChange={(event) => set("description", event.target.value)}
                className="mt-1.5 rounded-none border-ink/20 bg-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>نسبة الخصم %</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.discount_percentage}
                  onChange={(event) => set("discount_percentage", event.target.value)}
                  className="mt-1.5 rounded-none border-ink/20 bg-white"
                />
              </div>
              <div>
                <Label>تاريخ البداية</Label>
                <Input
                  type="date"
                  value={form.start_date || ""}
                  onChange={(event) => set("start_date", event.target.value)}
                  className="mt-1.5 rounded-none border-ink/20 bg-white"
                />
              </div>
              <div>
                <Label>تاريخ النهاية</Label>
                <Input
                  type="date"
                  value={form.end_date || ""}
                  onChange={(event) => set("end_date", event.target.value)}
                  className="mt-1.5 rounded-none border-ink/20 bg-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={Boolean(form.is_active)}
                onChange={(event) => set("is_active", event.target.checked)}
              />
              العرض نشط
            </label>

            <div className="border-t border-ink/10 pt-4">
              <Label>المنتجات المشمولة</Label>
              <p className="mt-1 text-[11px] text-ink/45">اتركيها فارغة لتطبيق العرض على كل المنتجات.</p>
              <Input
                placeholder="ابحثي عن منتج..."
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                className="mt-2 rounded-none border-ink/20 bg-white"
              />
              <div className="mt-2 max-h-56 overflow-y-auto border border-ink/10 bg-white">
                {filteredProducts.length === 0 ? (
                  <p className="px-3 py-4 text-center text-xs text-ink/40">لا توجد منتجات.</p>
                ) : (
                  filteredProducts.map((product) => {
                    const checked = form.applicable_products.includes(product.id);
                    return (
                      <label
                        key={product.id}
                        className="flex cursor-pointer items-center gap-3 border-b border-ink/5 px-3 py-2 last:border-0 hover:bg-ink/5"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProduct(product.id)}
                        />
                        <div className="h-8 w-7 shrink-0 overflow-hidden bg-ink/5">
                          {(product.image_url || product.images?.[0]) && (
                            <Image
                              src={product.image_url || product.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                              fittingType="fill"
                            />
                          )}
                        </div>
                        <span className="min-w-0 flex-1 truncate text-xs text-ink/70">{product.name}</span>
                        <span className="text-[10px] text-ink/40">
                          {formatPrice(Number(product.base_price ?? product.price ?? 0), product.currency)}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
              {form.applicable_products.length > 0 && (
                <p className="mt-2 text-[11px] text-royal">
                  {form.applicable_products.length} منتج محدّد
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-ink/10 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
                className="rounded-none border-ink/20 px-6 py-3 text-xs"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-none bg-royal px-8 py-3 text-xs text-cream hover:bg-royal/90"
              >
                {saving ? "جارٍ الحفظ..." : "حفظ"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}