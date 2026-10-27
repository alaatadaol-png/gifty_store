import React from "react";
import ChoiceRow from "@/components/shop/customizer/ChoiceRow";

export default function AddonStep({ addons, value, onToggle }) {
  return (
    <div>
      <h3 className="font-heading text-2xl">الإضافات</h3>
      <p className="mt-1 text-sm text-ink/50">
        يمكنك اختيار أكثر من إضافة واحدة.
      </p>

      <div className="mt-5 space-y-2.5">
        {addons.map((addon) => (
          <ChoiceRow
            key={addon.id}
            multi
            selected={value.includes(addon.id)}
            onClick={() => onToggle(addon.id)}
            title={addon.name}
            price={addon.price}
            currency={addon.currency}
          />
        ))}
      </div>
    </div>
  );
}