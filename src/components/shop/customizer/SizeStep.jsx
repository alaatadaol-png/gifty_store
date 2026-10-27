import React from "react";
import ChoiceRow from "@/components/shop/customizer/ChoiceRow";

export default function SizeStep({ sizes, value, onChange, blockedNames, box }) {
  return (
    <div>
      <h3 className="font-heading text-2xl">اختاري الحجم</h3>
      <p className="mt-1 text-sm text-ink/50">
        الحجم يحدد أقصى عدد من الورود في التنسيق.
      </p>

      {box && (
        <p className="mt-3 inline-block border border-gold/30 px-3 py-1.5 text-[11px] text-gold">
          الصندوق «{box.name}» {blockedNames.length ? "لا يقبل الحجم الصغير" : "يقبل جميع الأحجام"}
        </p>
      )}

      <div className="mt-5 space-y-2.5">
        {sizes.map((size) => {
          const blocked = blockedNames.includes(size.name);
          return (
            <ChoiceRow
              key={size.id}
              selected={value === size.id}
              disabled={blocked}
              onClick={() => onChange(size.id)}
              title={size.name}
              hint={
                blocked
                  ? "غير متاح مع الصندوق المختار"
                  : `حتى ${size.max_flowers} وردة`
              }
              price={size.price}
              currency={size.currency}
            />
          );
        })}
      </div>
    </div>
  );
}