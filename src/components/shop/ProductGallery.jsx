import React, { useState } from "react";

export default function ProductGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [""];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {list.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 transition-all ${
                active === i ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`${name} - ${i}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5 flex-1">
        {list[active] && (
          <img
            src={list[active]}
            alt={name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}