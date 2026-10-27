import React, { useState } from "react";
import { Facebook, Instagram, Mail, MessageCircle, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/brands";
import { cn } from "@/lib/utils";

const SUBJECTS = ["استفسار عن طلب", "تخصيص قطعة", "تنسيق مناسبة", "أخرى"];

const INITIAL = { name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" };

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSending(true);
    try {
      await base44.entities.ContactMessage.create(form);
      setSent(true);
      setForm(INITIAL);
    } catch {
      setError("تعذّر إرسال الرسالة، حاولي مرة أخرى أو راسلينا على إنستغرام.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section className="border-b border-ink/10 bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <p className="reveal text-[11px] tracking-[0.4em] text-gold">تواصل معنا</p>
          <h1 className="reveal mt-4 max-w-3xl font-heading text-4xl leading-[1.2] md:text-6xl">
            نحبّ أن نسمع منك
          </h1>
          <p className="reveal mt-5 max-w-xl text-sm leading-relaxed text-ink/55 md:text-base">
            لطلب خاص، تنسيق مناسبة، أو سؤال عن قطعة — اكتبي لنا التفاصيل وسنعود إليك
            بأقرب وقت.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-14 px-5 py-14 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-20">
        <div>
          {sent ? (
            <div className="flex flex-col items-start border border-gold/30 bg-white/60 px-8 py-14">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                <Send className="h-5 w-5" strokeWidth={1.4} />
              </span>
              <p className="mt-6 font-heading text-3xl">وصلت رسالتك</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/55">
                شكراً لتواصلك معنا. سنراجع رسالتك ونعود إليك على الرقم أو البريد الذي
                تركته.
              </p>
              <Button
                variant="outline"
                className="mt-7 rounded-none border-ink/25"
                onClick={() => setSent(false)}
              >
                إرسال رسالة أخرى
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] tracking-[0.22em] text-ink/45">الاسم</label>
                  <Input
                    required
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="اسمك الكامل"
                    className="mt-2 rounded-none border-ink/20 bg-white/70 py-5"
                  />
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.22em] text-ink/45">الهاتف</label>
                  <Input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="رقم الواتساب"
                    className="mt-2 rounded-none border-ink/20 bg-white/70 py-5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] tracking-[0.22em] text-ink/45">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="اختياري"
                  className="mt-2 rounded-none border-ink/20 bg-white/70 py-5"
                />
              </div>

              <div>
                <p className="text-[11px] tracking-[0.22em] text-ink/45">موضوع الرسالة</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SUBJECTS.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => update("subject", subject)}
                      className={cn(
                        "border px-4 py-2 text-xs transition-all",
                        form.subject === subject
                          ? "border-ink bg-ink text-cream"
                          : "border-ink/15 text-ink/60 hover:border-ink/40"
                      )}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] tracking-[0.22em] text-ink/45">رسالتك</label>
                <Textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(event) => update("message", event.target.value)}
                  placeholder="اكتبي تفاصيل طلبك أو سؤالك..."
                  className="mt-2 rounded-none border-ink/20 bg-white/70"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={sending}
                className="w-full rounded-none bg-royal py-6 text-sm tracking-wide text-cream hover:bg-royal/90 sm:w-auto sm:px-12"
              >
                {sending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-8">
          <div className="border border-ink/12 p-6">
            <p className="text-[11px] tracking-[0.28em] text-gold">تابعينا</p>
            <div className="mt-4 space-y-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-ink/65 transition-colors hover:text-royal"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.4} />
                إنستغرام
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-ink/65 transition-colors hover:text-royal"
              >
                <Facebook className="h-4 w-4" strokeWidth={1.4} />
                فيسبوك
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 text-sm text-ink/65 transition-colors hover:text-royal"
              >
                <Mail className="h-4 w-4" strokeWidth={1.4} />
                {SITE.email}
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-ink/65 transition-colors hover:text-royal"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
                واتساب
              </a>
            </div>
          </div>

          <div className="border border-ink/12 p-6">
            <p className="text-[11px] tracking-[0.28em] text-gold">أوقات العمل</p>
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              السبت – الخميس: ١٠ صباحاً – ٩ مساءً
              <br />
              الجمعة: ٢ مساءً – ٩ مساءً
            </p>
            <p className="mt-4 text-xs leading-relaxed text-ink/45">
              يُجهّز طلب الورود في نفس اليوم عند الطلب قبل الظهر.
            </p>
          </div>

          <div className="border border-ink/12 p-6">
            <p className="text-[11px] tracking-[0.28em] text-gold">التوصيل</p>
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              توصيل داخل المدينة خلال ٢٤ ساعة، وإلى باقي المدن ٢–٤ أيام عمل. الطلبات
              الخاصة والكميات تُرتّب مسبقاً.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}