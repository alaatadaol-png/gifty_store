import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function ProductGallery({ images, name, badge }) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
        {current && (
          <Image
            src={current}
            alt={name}
            className="h-full w-full object-cover"
            fittingType="fill"
          />
        )}
        {badge && (
          <span className="absolute right-4 top-4 bg-cream/95 px-3 py-1.5 text-[10px] tracking-[0.18em] text-ink/70">
            {badge}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`صورة ${index + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden border bg-ink/5 transition-opacity",
                index === active
                  ? "border-ink"
                  : "border-transparent opacity-65 hover:opacity-100"
              )}
            >
              <Image
                src={src}
                alt={`${name} ${index + 1}`}
                className="h-full w-full object-cover"
                fittingType="fill"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}