import React, { useEffect, useState } from "react";
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

const readList = async () => {
  const result = await base44.entities.SiteContent.list("-created_date", 100);
  return Array.isArray(result) ? result : result.items || [];
};

export default function AdminSiteContent() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    readList()
      .then((list) => {
        setRecords(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const startEdit = (record) => {
    setEditing(record);
    setValue(record.value || "");
  };

  const handleImage = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setValue(file_url);
    } catch {
      window.alert("تعذّر رفع الصورة. حاولي مرة أخرى.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await base44.entities.SiteContent.update(editing.id, { value });
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (record) => {
    if (!confirmDelete(`حذف عنصر «${record.key}»؟`)) return;
    await base44.entities.SiteContent.delete(record.id);
    load();
  };

  return (
    <div>
      <h2 className="font-heading text-2xl">إدارة محتوى الموقع</h2>
      <p className="mt-1 text-sm text-ink/50">
        عدّلي نصوص وصور الصفحة الرئيسية — تُحفظ التغييرات وتظهر فوراً في الموقع.
      </p>

      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : records.length === 0 ? (
          <EmptyState message="لا يوجد محتوى بعد." />
        ) : (
          <ul className="divide-y divide-ink/8 border border-ink/10 bg-white/60">
            {records.map((record) => (
              <li key={record.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm text-ink">{record.key}</p>
                    <span className="border border-ink/15 px-1.5 py-0.5 text-[10px] text-ink/45">
                      {record.type === "image" ? "صورة" : "نص"}
                    </span>
                  </div>
                  {record.type === "image" && record.value ? (
                    <div className="mt-2 h-16 w-16 overflow-hidden border border-ink/10">
                      <Image src={record.value} alt={record.key} className="h-full w-full object-cover" fittingType="fill" />
                    </div>
                  ) : (
                    <p className="mt-1 truncate text-[11px] text-ink/45">{record.value || "—"}</p>
                  )}
                </div>
                <RowActions onEdit={() => startEdit(record)} onDelete={() => remove(record)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg overflow-y-auto rounded-none border-ink/10 bg-cream">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">تعديل: {editing?.key}</DialogTitle>
          </DialogHeader>

          {editing && (
            <form onSubmit={save} className="space-y-4">
              {editing.type === "image" ? (
                <div>
                  <Label>الصورة</Label>
                  {value && (
                    <div className="mt-2 h-32 w-full overflow-hidden border border-ink/10">
                      <Image src={value} alt="" className="h-full w-full object-cover" fittingType="fill" />
                    </div>
                  )}
                  <label className="mt-2 flex h-24 w-full cursor-pointer items-center justify-center border border-dashed border-ink/25 text-xs text-ink/40 hover:border-ink/50">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => event.target.files && handleImage(event.target.files)}
                    />
                    {uploading ? "جارٍ الرفع..." : value ? "تغيير الصورة" : "رفع صورة"}
                  </label>
                </div>
              ) : (
                <div>
                  <Label>النص</Label>
                  <Textarea
                    rows={5}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    className="mt-1.5 rounded-none border-ink/20 bg-white"
                  />
                </div>
              )}

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
                  disabled={saving || uploading}
                  className="rounded-none bg-royal px-8 py-3 text-xs text-cream hover:bg-royal/90"
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}