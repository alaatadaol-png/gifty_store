import React from "react";
import { cn } from "@/lib/utils";

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <div className="flex min-w-max items-center gap-2 pb-1">
        {categories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              className={cn(
                "border px-4 py-2 text-xs tracking-[0.1em] transition-all duration-300",
                isActive
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}