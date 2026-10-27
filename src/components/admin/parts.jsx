import React from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-ink/15 border-t-royal" />
    </div>
  );
}

export function Section({ title, description, action, children }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-4">
        <div>
          <h2 className="font-heading text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink/50">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <div className="border border-ink/10 bg-white/70 p-5">
      <p className="text-[11px] tracking-[0.24em] text-gold">{label}</p>
      <p className="mt-3 font-heading text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}

export function EmptyState({ message, className }) {
  return (
    <div className={cn("border border-dashed border-ink/15 py-14 text-center text-sm text-ink/45", className)}>
      {message || "لا توجد عناصر بعد."}
    </div>
  );
}

export function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="text-xs text-royal transition-colors hover:text-royal/70"
      >
        تعديل
      </button>
      <span className="text-ink/20">|</span>
      <button
        type="button"
        onClick={onDelete}
        className="text-xs text-[#9c5c5c] transition-colors hover:text-[#7e4848]"
      >
        حذف
      </button>
    </div>
  );
}

export const confirmDelete = (message) => window.confirm(message || "هل تريد الحذف؟");