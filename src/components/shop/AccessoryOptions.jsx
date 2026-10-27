import React from "react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/brands";
import { accessoryOptionValues } from "@/lib/products";

// خيارات تخصيص الإكسسوارات — قوائم منسدلة وحقول كتابة حرة
// الخيار ذو extra_price يُضاف للسعر الإجمالي بمجرد اختياره
export default function AccessoryOptions({ options, values, onChange }) {
  if (!options.length) return null;

  return (
    <div className="mt-9 border-t border-ink/10 pt-6">
      <p className="text-[11px] tracking-[0.28em] text-gold">خيارات التخصيص</p>
      <p className="mt-1 text-[11px] text-ink/40">
        اختاري ما يناسب قطعتك — يُحدّث السعر تلقائياً.
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {options.map((option) => {
          const choices = accessoryOptionValues(option);
          const surcharge = Number(option.extra_price || 0);

          if (option.has_custom_text) {
            return (
              <label key={option.id} className="block">
                <span className="flex items-center justify-between text-xs text-ink/55">
                  <span>{option.option_name}</span>
                  {surcharge > 0 && (
                    <span className="text-gold">+ {formatPrice(surcharge, option.currency)}</span>
                  )}
                </span>
                <Input
                  value={values[option.option_name] || ""}
                  onChange={(event) => onChange(option.option_name, event.target.value)}
                  placeholder="اكتبي هنا..."
                  className="mt-1.5 rounded-none border-ink/20 bg-white/70"
                />
              </label>
            );
          }

          return (
            <label key={option.id} className="block">
              <span className="flex items-center justify-between text-xs text-ink/55">
                <span>{option.option_name}</span>
                {surcharge > 0 && (
                  <span className="text-gold">+ {formatPrice(surcharge, option.currency)}</span>
                )}
                </span>
                <select
                value={values[option.option_name] || ""}
                onChange={(event) => onChange(option.option_name, event.target.value)}
                className="mt-1.5 w-full cursor-pointer appearance-none rounded-none border border-ink/20 bg-white/70 px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/50"
              >
                <option value="">اختاري...</option>
                {choices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
    </div>
  );
}