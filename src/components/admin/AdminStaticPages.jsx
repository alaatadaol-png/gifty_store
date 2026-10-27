import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/admin/parts";

const ABOUT_TITLE = "من نحن";
const FAQ_TITLE = "الأسئلة الشائعة";

const parseFaq = (content) => {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function AdminStaticPages() {
  const [about, setAbout] = useState("");
  const [faq, setFaq] = useState([]);
  const [aboutId, setAboutId] = useState(null);
  const [faqId, setFaqId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");

  useEffect(() => {
    supabase.from("static_pages").select("*").then(({ data }) => {
      if (data) {
        const aboutPage = data.find((page) => page.title === ABOUT_TITLE);
        const faqPage = data.find((page) => page.title === FAQ_TITLE);
        if (aboutPage) {
          setAbout(aboutPage.content || "");
          setAboutId(aboutPage.id);
        }
        if (faqPage) {
          setFaq(parseFaq(faqPage.content));
          setFaqId(faqPage.id);
        }
      }
      setLoading(false);
    });
  }, []);

  const saveAbout = async () => {
    setSaving("about");
    try {
      if (aboutId) {
        await supabase.from("static_pages").update({ content: about }).eq("id", aboutId);
      } else {
        const { data } = await supabase.from("static_pages").insert([{ title: ABOUT_TITLE, content: about }]).select().single();
        if (data) setAboutId(data.id);
      }
    } finally {
      setSaving("");
    }
  };

  const updateFaqRow = (index, key, value) => setFaq((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const addFaqRow = () => setFaq((current) => [...current, { q: "", a: "" }]);
  const removeFaqRow = (index) => setFaq((current) => current.filter((_, i) => i !== index));

  const saveFaq = async () => {
    setSaving("faq");
    try {
      const content = JSON.stringify(faq.filter((row) => row.q.trim() || row.a.trim()));
      if (faqId) {
        await supabase.from("static_pages").update({ content }).eq("id", faqId);
      } else {
        const { data } = await supabase.from("static_pages").insert([{ title: FAQ_TITLE, content }]).select().single();
        if (data) setFaqId(data.id);
      }
    } finally {
      setSaving("");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="font-heading text-2xl">الصفحات الثابتة</h2>
      <p className="mt-1 text-sm text-ink/50">عدّلي محتوى صفحتي «من نحن» و«الأسئلة الشائعة».</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-ink/10 bg-white/60 p-5">
          <h3 className="font-heading text-lg">من نحن</h3>
          <Textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={10} placeholder="نص مقدمة صفحة «من نحن»..." className="mt-3 rounded-none border-ink/20 bg-white text-sm leading-relaxed" />
          <Button type="button" onClick={saveAbout} disabled={saving === "about"} className="mt-3 rounded-none bg-royal px-6 py-3 text-xs text-cream hover:bg-royal/90">
            {saving === "about" ? "جارٍ الحفظ..." : "حفظ"}
          </Button>
        </div>

        <div className="border border-ink/10 bg-white/60 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg">الأسئلة الشائعة</h3>
            <Button type="button" onClick={addFaqRow} className="rounded-none bg-ink px-4 py-2 text-xs text-cream hover:bg-ink/90">إضافة سؤال</Button>
          </div>

          <div className="mt-3 space-y-3">
            {faq.map((row, index) => (
              <div key={index} className="border border-ink/8 bg-white p-3">
                <Input value={row.q} onChange={(e) => updateFaqRow(index, "q", e.target.value)} placeholder="السؤال" className="rounded-none border-ink/20 text-sm" />
                <Textarea value={row.a} onChange={(e) => updateFaqRow(index, "a", e.target.value)} rows={2} placeholder="الجواب" className="mt-2 rounded-none border-ink/20 text-sm" />
                <button type="button" onClick={() => removeFaqRow(index)} className="mt-2 text-xs text-[#9c5c5c] hover:text-[#7e4848]">حذف السؤال</button>
              </div>
            ))}
          </div>
          <Button type="button" onClick={saveFaq} disabled={saving === "faq"} className="mt-4 rounded-none bg-royal px-6 py-3 text-xs text-cream hover:bg-royal/90">
            {saving === "faq" ? "جارٍ الحفظ..." : "حفظ الأسئلة"}
          </Button>
        </div>
      </div>
    </div>
  );
}