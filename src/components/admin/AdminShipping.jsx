import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, RowActions, Spinner, confirmDelete } from "@/components/admin/parts";
import { formatPrice } from "@/lib/brands";

export default function AdminShipping() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ region: "", price: "", currency: "USD" });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("shipping_rates").select("*").order("created_at", { ascending: false });
    if (data) setRates(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { region: draft.region.trim(), price: Number(draft.price || 0), currency: draft.currency || "USD" };
      if (editing) {
        await supabase.from("shipping_rates").update(payload).eq("id", editing);
      } else {
        await supabase.from("shipping_rates").insert([payload]);
      }
      setEditing(null);
      setDraft({ region: "", price: "", currency: "USD" });
      load();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (rate) => {
    setEditing(rate.id);
    setDraft({ region: rate.region, price: rate.price, currency: rate.currency || "USD" });
  };
  const cancel = () => {
    setEditing(null);
    setDraft({ region: "", price: "", currency: "USD" });
  };
  const remove = async (rate) => {
    if (!confirmDelete(`حذف منطقة «${rate.region}»؟`)) return;
    await supabase.from("shipping_rates").delete().eq("id", rate.id);
    load();
  };

  return (
    <div>
      <h2 className="font-heading text-2xl">إدارة التوصيل</h2>
      <p className="mt-1 text-sm text-ink/50">أسعار التوصيل لكل محافظة أو منطقة.</p>

      <form onSubmit={submit} className="mt-6 flex flex-wrap items-end gap-3 border border-ink/10 bg-white/60 p-4">
        <label className="block">
          <span className="text-xs text-ink/55">المنطقة</span>
          <Input required value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })} className="mt-1.5 rounded-none border-ink/20 bg-white" />
        </label>
        <label className="block">
          <span className="text-xs text-ink/55">السعر</span>
          <div className="mt-1.5 flex gap-2">
            <Input type="number" required value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className="flex-1 rounded-none border-ink/20 bg-white" />
            <select value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value })} className="rounded-none border border-ink/20 bg-white px-3 py-2.5 text-sm">
              <option value="USD">دولار أمريكي</option>
              <option value="SYP">ليرة سورية</option>
            </select>
          </div>
        </label>
        <Button type="submit" disabled={saving} className="rounded-none bg-royal px-6 py-3 text-xs text-cream hover:bg-royal/90">
          {saving ? "جارٍ الحفظ..." : editing ? "حفظ التعديل" : "إضافة"}
        </Button>
        {editing && <Button type="button" variant="outline" onClick={cancel} className="rounded-none border-ink/20 px-6 py-3 text-xs">إلغاء</Button>}
      </form>

      <div className="mt-5">
        {loading ? <Spinner /> : rates.length === 0 ? <EmptyState message="لا توجد مناطق بعد." /> : (
          <ul className="divide-y divide-ink/8 border border-ink/10 bg-white/60">
            {rates.map((rate) => (
              <li key={rate.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm text-ink">{rate.region}</p>
                  <p className="mt-0.5 text-xs text-ink/50">{formatPrice(rate.price, rate.currency)}</p>
                </div>
                <RowActions onEdit={() => startEdit(rate)} onDelete={() => remove(rate)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}