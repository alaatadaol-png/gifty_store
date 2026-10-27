import React, { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CURRENCIES } from "@/lib/brands";

export default function ProductForm({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    base_price: product?.base_price || 0,
    currency: product?.currency || "USD",
    category: product?.category || "هدايا",
    sub_category: product?.sub_category || "",
    is_customizable: product?.is_customizable || false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = product?.images?.[0] || null;

      // 1. رفع الصورة إذا تم اختيارها
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // 2. تجهيز البيانات للحفظ
      const payload = {
        ...formData,
        base_price: Number(formData.base_price),
        images: imageUrl ? [imageUrl] : [],
      };

      // 3. الحفظ أو التحديث
      if (product) {
        await supabase.from("products").update(payload).eq("id", product.id);
      } else {
        await supabase.from("products").insert([payload]);
      }

      onSave();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحفظ: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-ink/10 p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h3 className="font-heading text-xl">{product ? "تعديل منتج" : "إضافة منتج جديد"}</h3>
        <Button variant="outline" type="button" onClick={onClose} className="rounded-none">إلغاء</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs mb-1 block">اسم المنتج</label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="text-xs mb-1 block">الفئة</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 text-sm">
            <option value="هدايا">هدايا</option>
            <option value="اكسسوارات">اكسسوارات</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs mb-1 block">الوصف</label>
        <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs mb-1 block">السعر</label>
          <Input type="number" name="base_price" value={formData.base_price} onChange={handleChange} required />
        </div>
        <div>
          <label className="text-xs mb-1 block">العملة</label>
          <select name="currency" value={formData.currency} onChange={handleChange} className="w-full border p-2 text-sm">
            {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="is_customizable" checked={formData.is_customizable} onChange={handleChange} className="w-4 h-4" />
            قابل للتخصيص
          </label>
        </div>
      </div>

      <div>
        <label className="text-xs mb-1 block">صورة المنتج</label>
        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        {product?.images?.[0] && !imageFile && (
          <p className="text-xs text-ink/50 mt-2">توجد صورة سابقة محفوظة. اختر صورة جديدة لاستبدالها.</p>
        )}
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" disabled={saving} className="bg-royal text-cream rounded-none px-8">
          {saving ? "جاري الحفظ..." : "حفظ المنتج"}
        </Button>
      </div>
    </form>
  );
}