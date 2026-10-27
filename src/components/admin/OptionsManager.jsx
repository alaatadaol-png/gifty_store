import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, RowActions, Spinner, confirmDelete } from "@/components/admin/parts";

const readList = async (entity) => {
  const result = await base44.entities[entity].list("-created_date", 100);
  return Array.isArray(result) ? result : result.items || [];
};

const emptyRecord = (fields) =>
  fields.reduce((acc, field) => {
    acc[field.key] = field.type === "boolean" ? false : field.type === "number" ? 0 : "";
    return acc;
  }, { currency: "USD" });

// مدير عام لخيارات التخصيص (صناديق/أحجام/ورود/تغليف/إضافات/خيارات الإكسسوارات)
export default function OptionsManager({ title, entity, fields, preview }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    readList(entity)
      .then((list) => {
        setRecords(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, [entity]);

  const startAdd = () => setDraft({ ...emptyRecord(fields), id: null });
  const startEdit = (record) => setDraft({ ...record });
  const cancel = () => setDraft(null);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = fields.reduce((acc, field) => {
        let value = draft[field.key];
        if (field.type === "number") value = Number(value || 0);
        if (field.type === "boolean") value = Boolean(value);
        acc[field.key] = value;
        return acc;
      }, {});
      if (fields.some((field) => field.withCurrency)) {
        payload.currency = draft.currency || "USD";
      }
      if (draft.id) {
        await base44.entities[entity].update(draft.id, payload);
      } else {
        await base44.entities[entity].create(payload);
      }
      setDraft(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (record) => {
    if (!confirmDelete(`حذف «${preview(record).title}»؟`)) return;
    await base44.entities[entity].delete(record.id);
    load();
  };

  return (
    <div className="border border-ink/10 bg-white/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-lg">{title}</h3>
        <Button
          type="button"
          onClick={startAdd}
          className="rounded-none bg-ink px-4 py-2 text-xs text-cream hover:bg-ink/90"
        >
          إضافة
        </Button>
      </div>

      {loading ? (
        <Spinner className="py-8" />
      ) : records.length === 0 ? (
        <EmptyState className="mt-4" message="لا توجد خيارات بعد." />
      ) : (
        <ul className="mt-4 divide-y divide-ink/8">
          {records.map((record) => {
            const info = preview(record);
            return (
              <li key={record.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{info.title}</p>
                  {info.subtitle && (
                    <p className="mt-0.5 truncate text-[11px] text-ink/45">{info.subtitle}</p>
                  )}
                </div>
                <RowActions onEdit={() => startEdit(record)} onDelete={() => remove(record)} />
              </li>
            );
          })}
        </ul>
      )}

      {draft && (
        <form onSubmit={save} className="mt-5 border-t border-ink/10 pt-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className="block">
                <span className="text-xs text-ink/55">{field.label}</span>
                {field.type === "boolean" ? (
                  <label className="mt-1.5 flex items-center gap-2 text-sm text-ink/70">
                    <input
                      type="checkbox"
                      checked={Boolean(draft[field.key])}
                      onChange={(event) =>
                        setDraft({ ...draft, [field.key]: event.target.checked })
                      }
                    />
                    نعم
                  </label>
                ) : field.withCurrency ? (
                  <div className="mt-1.5 flex gap-2">
                    <Input
                      type={field.type === "number" ? "number" : "text"}
                      value={draft[field.key]}
                      onChange={(event) =>
                        setDraft({ ...draft, [field.key]: event.target.value })
                      }
                      placeholder={field.placeholder || ""}
                      className="flex-1 rounded-none border-ink/20 bg-white"
                    />
                    <select
                      value={draft.currency || "USD"}
                      onChange={(event) =>
                        setDraft({ ...draft, currency: event.target.value })
                      }
                      className="rounded-none border border-ink/20 bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="USD">دولار أمريكي</option>
                      <option value="SYP">ليرة سورية</option>
                    </select>
                  </div>
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : "text"}
                    value={draft[field.key]}
                    onChange={(event) =>
                      setDraft({ ...draft, [field.key]: event.target.value })
                    }
                    placeholder={field.placeholder || ""}
                    className="mt-1.5 rounded-none border-ink/20 bg-white"
                  />
                )}
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-none bg-royal px-6 py-3 text-xs text-cream hover:bg-royal/90"
            >
              {saving ? "جارٍ الحفظ..." : draft.id ? "حفظ التعديل" : "إضافة"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={cancel}
              className="rounded-none border-ink/20 px-6 py-3 text-xs"
            >
              إلغاء
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}