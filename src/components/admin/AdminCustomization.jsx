import React from "react";
import OptionsManager from "@/components/admin/OptionsManager";
import { formatPrice } from "@/lib/brands";

const money = (value, currency) => formatPrice(Number(value || 0), currency);

export default function AdminCustomization() {
  return (
    <div>
      <h2 className="font-heading text-2xl">خيارات التخصيص</h2>
      <p className="mt-1 text-sm text-ink/50">أضيفي أو عدّلي أسعار الصناديق والأحجام والورود والتغليف والإضافات وخيارات الإكسسوارات.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <OptionsManager
          title="صناديق الهدايا"
          entity="gift_boxes"
          fields={[
            { key: "name", label: "اسم الصندوق" },
            { key: "price", label: "السعر", type: "number", withCurrency: true },
            { key: "is_sunflower_compatible", label: "يقبل عباد الشمس", type: "boolean" },
          ]}
          preview={(record) => ({
            title: record.name,
            subtitle: `${money(record.price, record.currency)}${record.is_sunflower_compatible ? " · يقبل عباد الشمس" : ""}`,
          })}
        />

        <OptionsManager
          title="الأحجام"
          entity="gift_sizes"
          fields={[
            { key: "name", label: "اسم الحجم" },
            { key: "price", label: "السعر", type: "number", withCurrency: true },
            { key: "min_flowers", label: "أقل عدد ورود", type: "number" },
            { key: "max_flowers", label: "أكثر عدد ورود", type: "number" },
          ]}
          preview={(record) => ({
            title: record.name,
            subtitle: `${money(record.price, record.currency)} · ${record.min_flowers}–${record.max_flowers} وردة`,
          })}
        />

        <OptionsManager
          title="الورود"
          entity="gift_flowers"
          fields={[
            { key: "name", label: "نوع الوردة" },
            { key: "price_per_stem", label: "سعر الوردة", type: "number", withCurrency: true },
          ]}
          preview={(record) => ({
            title: record.name,
            subtitle: `${money(record.price_per_stem, record.currency)} للوردة`,
          })}
        />

        <OptionsManager
          title="التغليف"
          entity="gift_wrappings"
          fields={[
            { key: "name", label: "نوع التغليف" },
            { key: "price", label: "السعر", type: "number", withCurrency: true },
          ]}
          preview={(record) => ({ title: record.name, subtitle: money(record.price, record.currency) })}
        />

        <OptionsManager
          title="الإضافات"
          entity="gift_addons"
          fields={[
            { key: "name", label: "اسم الإضافة" },
            { key: "price", label: "السعر", type: "number", withCurrency: true },
          ]}
          preview={(record) => ({ title: record.name, subtitle: money(record.price, record.currency) })}
        />

        <OptionsManager
          title="خيارات الإكسسوارات"
          entity="accessory_options"
          fields={[
            { key: "option_name", label: "اسم الخيار" },
            { key: "option_values", label: "القيم (مفصولة بفاصلة)" },
            { key: "extra_price", label: "سعر إضافي", type: "number", withCurrency: true },
            { key: "has_custom_text", label: "كتابة حرة", type: "boolean" },
          ]}
          preview={(record) => ({
            title: record.option_name,
            subtitle: `${record.option_values || "—"}${record.extra_price ? ` · +${money(record.extra_price, record.currency)}` : ""}`,
          })}
        />
      </div>
    </div>
  );
}