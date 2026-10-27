import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";

let cache = null;
let promise = null;

export function useSiteContent() {
  const [map, setMap] = useState(cache || {});

  useEffect(() => {
    if (cache) {
      setMap(cache);
      return;
    }
    if (!promise) {
      promise = supabase
        .from('site_content')
        .select('*')
        .then(({ data, error }) => {
          if (error || !data) {
            cache = {};
            return {};
          }
          const next = {};
          data.forEach((item) => {
            next[item.key] = item;
          });
          cache = next;
          return next;
        });
    }
    promise.then(setMap);
  }, []);

  return map;
}

export const contentValue = (map, key, fallback) =>
  map[key]?.value || fallback;