import React from "react";
import SelectCard from "@/components/shop/customizer/SelectCard";

export default function BoxStep({ boxes, value, onChange }) {
  return (
    <div>
      <h3 className="font-heading text-2xl">اختاري الصندوق</h3>
      <p className="mt-1 text-sm text-ink/50">
        الصندوق الذي يحمل هديتك — بعض الصناديق لا تقبل الحجم الصغير.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {boxes.map((box) => (
          <SelectCard
            key={box.id}
            selected={value === box.id}
            onClick={() => onChange(box.id)}
            title={box.name}
            price={box.price}
            currency={box.currency}
            image={box.image}
          />
        ))}
      </div>
    </div>
  );
}