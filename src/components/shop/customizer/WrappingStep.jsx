import React from "react";
import ChoiceRow from "@/components/shop/customizer/ChoiceRow";

export default function WrappingStep({ wrappings, value, onChange }) {
  return (
    <div>
      <h3 className="font-heading text-2xl">اختاري التغليف</h3>
      <p className="mt-1 text-sm text-ink/50">لمسة أخيرة تُكمل شكل الهدية.</p>

      <div className="mt-5 space-y-2.5">
        {wrappings.map((wrapping) => (
          <ChoiceRow
            key={wrapping.id}
            selected={value === wrapping.id}
            onClick={() => onChange(wrapping.id)}
            title={wrapping.name}
            price={wrapping.price}
            currency={wrapping.currency}
          />
        ))}
      </div>
    </div>
  );
}